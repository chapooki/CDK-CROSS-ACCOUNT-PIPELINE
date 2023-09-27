import * as cdk from "aws-cdk-lib";
import {
  ManagedPolicy,
  PolicyStatement,
  Effect,
} from "aws-cdk-lib/aws-iam";
import { Constants } from "../../config/AppConstants";
import { Construct } from "constructs";

export class EnvTeamPermissionsConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string
  ) {
    super(scope, id);

    // The adminAccessPolicy is used in creating PermissionSet for the Admin Group in IAM Identity centre
    const adminAccessPolicy = new ManagedPolicy(
      this,
      `${Constants.appName}-admin-access-policy`,
      {
        managedPolicyName: `${Constants.appName}-admin-access-policy`,
        statements: [
          new PolicyStatement({
            actions: ["*"],
            effect: Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      }
    );
    cdk.Tags.of(adminAccessPolicy).add("application", Constants.appName);

    // The developerAccessPolicy is used in creating PermissionSet for the Developer Group in IAM Identity centre
    const developerAccessPolicy = new ManagedPolicy(
      this,
      `${Constants.appName}-developer-access-policy`,
      {
        managedPolicyName: `${Constants.appName}-developer-access-policy`,
        statements: [
          new PolicyStatement({
            actions: ["codepipeline:*", "codedeploy:*", "codebuild:*"],
            effect: Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      }
    );
    cdk.Tags.of(developerAccessPolicy).add("application", Constants.appName);
  }
}
