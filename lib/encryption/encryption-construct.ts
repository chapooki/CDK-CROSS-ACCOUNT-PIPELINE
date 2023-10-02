
import { Construct } from "constructs";
import { aws_kms, aws_iam } from 'aws-cdk-lib';
import { PipelineConstants } from "../values";
import { Constants } from "../../config/AppConstants";
import { environmentProps } from '../values';

export interface Props {
  environment: environmentProps
}

export class EncryptionConstruct extends Construct {
  public readonly encryptionKeyArn: string;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const artifactsKey = new aws_kms.Key(this, "ArtifactsKey", {
      alias: `${Constants.appName}-artifacts-key`,
    });

    this.encryptionKeyArn = artifactsKey.keyArn;

    const environmentValues = new PipelineConstants();

      const deploymentRole = aws_iam.Role.fromRoleArn(
        this,
        "deploymentRole",
        environmentValues.getRoleArn(
          props.environment.accountId,
          Constants.cloudFormationRoleName
        ),
        {
          mutable: false,
        }
      );

      const crossAccountRole = aws_iam.Role.fromRoleArn(
        this,
        "crossAccountRole",
        environmentValues.getRoleArn(
          props.environment.accountId,
          Constants.codePipelineRoleName
        ),
        {
          mutable: false,
        }
      );

      const accountRootPrincipal = new aws_iam.AccountPrincipal(
        props.environment.accountId
      );

      artifactsKey.grantAdmin(accountRootPrincipal);
      artifactsKey.grantAdmin(deploymentRole);
      artifactsKey.grantAdmin(crossAccountRole);

      artifactsKey.grantEncryptDecrypt(accountRootPrincipal);
      artifactsKey.grantEncryptDecrypt(deploymentRole);
      artifactsKey.grantEncryptDecrypt(crossAccountRole);
  }
}
