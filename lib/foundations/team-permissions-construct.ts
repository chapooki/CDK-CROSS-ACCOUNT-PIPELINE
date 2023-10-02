import { aws_iam, Tags } from "aws-cdk-lib";
import { Constants } from "../../config/AppConstants";
import { Construct } from "constructs";

export class TeamPermissionsConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string
  ) {
    super(scope, id);

    // The adminAccessPolicy is used in creating PermissionSet for the Admin Group in IAM Identity centre
    const adminAccessPolicy = new aws_iam.ManagedPolicy(
      this,
      `${Constants.appName}-admin-access-policy`,
      {
        managedPolicyName: `${Constants.appName}-admin-access-policy`,
        statements: [
          new aws_iam.PolicyStatement({
            actions: ["*"],
            effect: aws_iam.Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      }
    );
    Tags.of(adminAccessPolicy).add("application", Constants.appName);

    // The developerAccessPolicy is used in creating PermissionSet for the Developer Group in IAM Identity centre
    const developerAccessPolicy = new aws_iam.ManagedPolicy(
      this,
      `${Constants.appName}-developer-access-policy`,
      {
        managedPolicyName: `${Constants.appName}-developer-access-policy`,
        statements: [
          new aws_iam.PolicyStatement({
            actions: ["codepipeline:*", "codedeploy:*", "codebuild:*"],
            effect: aws_iam.Effect.ALLOW,
            resources: ["*"],
          }),
        ],
      }
    );
    Tags.of(developerAccessPolicy).add("application", Constants.appName);
  }
}
