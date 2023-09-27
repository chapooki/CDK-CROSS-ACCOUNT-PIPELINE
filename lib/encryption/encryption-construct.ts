
import { Construct } from "constructs";
import kms = require("@aws-cdk/aws-kms");
import { PipelineConstants } from "../values";
import * as iam from "@aws-cdk/aws-iam";
import { Constants } from "../../config/AppConstants";

export class EncryptionConstruct extends Construct {
  public readonly encryptionKeyArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const artifactsKey = new kms.Key(this, "ArtifactsKey", {
      alias: `${Constants.appName}-artifacts-key`,
    });

    this.encryptionKeyArn = artifactsKey.keyArn;

    const environmentValues = new PipelineConstants();

    // Dev account wireup
    if (environmentValues.devProps.active) {
      const devDeploymentRole = iam.Role.fromRoleArn(
        this,
        "devDeploymentRole",
        environmentValues.getRoleArn(
          environmentValues.devProps.accountId,
          Constants.cloudFormationRoleName
        ),
        {
          mutable: false,
        }
      );

      const devCrossAccountRole = iam.Role.fromRoleArn(
        this,
        "devCrossAccountRole",
        environmentValues.getRoleArn(
          environmentValues.devProps.accountId,
          Constants.codePipelineRoleName
        ),
        {
          mutable: false,
        }
      );

      const devAccountRootPrincipal = new iam.AccountPrincipal(
        environmentValues.devProps.accountId
      );

      artifactsKey.grantAdmin(devAccountRootPrincipal);
      artifactsKey.grantAdmin(devDeploymentRole);
      artifactsKey.grantAdmin(devCrossAccountRole);

      artifactsKey.grantEncryptDecrypt(devAccountRootPrincipal);
      artifactsKey.grantEncryptDecrypt(devDeploymentRole);
      artifactsKey.grantEncryptDecrypt(devCrossAccountRole);
    }

    //Test account wireup
    if (environmentValues.testProps.active) {
      const testDeploymentRole = iam.Role.fromRoleArn(
        this,
        "testDeploymentRole",
        environmentValues.getRoleArn(
          environmentValues.testProps.accountId,
          Constants.cloudFormationRoleName
        ),
        {
          mutable: false,
        }
      );

      const testCrossAccountRole = iam.Role.fromRoleArn(
        this,
        "testCrossAccountRole",
        environmentValues.getRoleArn(
          environmentValues.testProps.accountId,
          Constants.codePipelineRoleName
        ),
        {
          mutable: false,
        }
      );

      const testAccountRootPrincipal = new iam.AccountPrincipal(
        environmentValues.testProps.accountId
      );

      artifactsKey.grantDecrypt(testAccountRootPrincipal);
      artifactsKey.grantDecrypt(testCrossAccountRole);
      artifactsKey.grantDecrypt(testDeploymentRole);
    }

    //Production Account wireup
    if (environmentValues.prodProps.active) {
      const prodDeploymentRole = iam.Role.fromRoleArn(
        this,
        "prodDeploymentRole",
        environmentValues.getRoleArn(
          environmentValues.prodProps.accountId,
          Constants.cloudFormationRoleName
        ),
        {
          mutable: false,
        }
      );

      const prodCrossAccountRole = iam.Role.fromRoleArn(
        this,
        "prodCrossAccountRole",
        environmentValues.getRoleArn(
          environmentValues.prodProps.accountId,
          Constants.codePipelineRoleName
        ),
        {
          mutable: false,
        }
      );

      const prodAccountRootPrincipal = new iam.AccountPrincipal(
        environmentValues.prodProps.accountId
      );

      artifactsKey.grantDecrypt(prodAccountRootPrincipal);
      artifactsKey.grantDecrypt(prodCrossAccountRole);
      artifactsKey.grantDecrypt(prodDeploymentRole);
    }
  }
}
