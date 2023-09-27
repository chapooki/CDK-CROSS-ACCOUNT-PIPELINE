import * as cdk from "aws-cdk-lib";
import {
  Role,
  ManagedPolicy,
  ServicePrincipal,
  PolicyStatement,
  AccountPrincipal,
  Effect,
} from "aws-cdk-lib/aws-iam";
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
    const pipelineRole = new Role(this, `${Constants.appName}-pipeline-role`, {
      roleName: `${Constants.appName}-pipeline-role`,
      assumedBy: new AccountPrincipal(Constants.toolsProps.accountId),
      managedPolicies: [
        new ManagedPolicy(this, `${Constants.appName}-artifact-access-policy`, {
          managedPolicyName: `${Constants.appName}-artifact-access-policy`,
          statements: [
            new PolicyStatement({
              actions: ["cloudformation:*", "iam:PassRole"],
              effect: Effect.ALLOW,
              resources: ["*"],
            }),
            new PolicyStatement({
              actions: ["s3:Get*", "s3:Put*", "s3:ListBucket"],
              effect: Effect.ALLOW,
              resources: ["arn:aws:s3:::*"],
            }),
            new PolicyStatement({
              actions: [
                "kms:DescribeKey",
                "kms:GenerateDataKey*",
                "kms:Encrypt",
                "kms:ReEncrypt*",
                "kms:Decrypt",
              ],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:kms:${Constants.region}:${props.accountId}:key/*`,
              ],
            }),
            new PolicyStatement({
              actions: ["codebuild:*"],
              effect: Effect.ALLOW,
              resources: [
                `arn:aws:codebuild:${Constants.region}:${props.accountId}:project/*`,
              ],
            }),
          ],
        }),
      ],
    });
    cdk.Tags.of(pipelineRole).add("application", Constants.appName);
  }
}
