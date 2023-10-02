import { aws_iam, Tags } from 'aws-cdk-lib';
import { Constants } from "../../config/AppConstants";
import { Construct } from "constructs";

export interface FoundationPermissionsConstructProps {
  accountId: string;
}

export class ToolsFoundationPermissionsConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: FoundationPermissionsConstructProps
  ) {
    super(scope, id);   

    // The role assumed by pipeline required to deploy cross-account
    const pipelineRole = new aws_iam.Role(this, `${Constants.appName}-pipeline-role`, {
      roleName: `${Constants.appName}-pipeline-role`,
      assumedBy: new aws_iam.AccountPrincipal(Constants.toolsProps.accountId),
      managedPolicies: [
        new aws_iam.ManagedPolicy(this, `${Constants.appName}-artifact-access-policy`, {
          managedPolicyName: `${Constants.appName}-artifact-access-policy`,
          statements: [
            new aws_iam.PolicyStatement({
              actions: ["cloudformation:*", "iam:PassRole"],
              effect: aws_iam.Effect.ALLOW,
              resources: ["*"],
            }),
            new aws_iam.PolicyStatement({
              actions: ["s3:Get*", "s3:Put*", "s3:ListBucket"],
              effect: aws_iam.Effect.ALLOW,
              resources: ["arn:aws:s3:::*"],
            }),
            new aws_iam.PolicyStatement({
              actions: [
                "kms:DescribeKey",
                "kms:GenerateDataKey*",
                "kms:Encrypt",
                "kms:ReEncrypt*",
                "kms:Decrypt",
              ],
              effect: aws_iam.Effect.ALLOW,
              resources: [
                `arn:aws:kms:${Constants.region}:${props.accountId}:key/*`,
              ],
            }),
            new aws_iam.PolicyStatement({
              actions: ["codebuild:*"],
              effect: aws_iam.Effect.ALLOW,
              resources: [
                `arn:aws:codebuild:${Constants.region}:${props.accountId}:project/*`,
              ],
            }),
          ],
        }),
      ],
    });
    Tags.of(pipelineRole).add("application", Constants.appName);
  }
}
