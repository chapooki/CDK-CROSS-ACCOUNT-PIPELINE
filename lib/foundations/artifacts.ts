import * as cdk from '@aws-cdk/core';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3'
import { environmentProps } from '../values';
import * as iam from '@aws-cdk/aws-iam';

export interface Props {
    environment: environmentProps,
    getRoleArn: (account: string, roleName: string) => string,
    artifactsKeys: kms.Key[],
    artifactBucket: s3.Bucket
}

export class CrossAccountConstruct extends cdk.Construct {

    public deploymentRole: iam.IRole;
    public crossAccountRole: iam.IRole;

    constructor(scope: cdk.Construct, id: string, props: Props) {
        super(scope, id);

        this.deploymentRole = iam.Role.fromRoleArn(this, `${props.environment.envType}DeploymentRole`,
            props.getRoleArn(props.environment.accountId, props.environment.cloudFormationRoleName), {
            mutable: false
        });

        this.crossAccountRole = iam.Role.fromRoleArn(this, `${props.environment.envType}CrossAccountRole`,
            props.getRoleArn(props.environment.accountId, props.environment.codePipelineRoleName), {
            mutable: false
        });

        const accountRootPrincipal = new iam.AccountPrincipal(props.environment.accountId);

        if (props.artifactsKeys && props.artifactsKeys.length > 0)
            props.artifactsKeys.forEach((key) => {
                key.grantAdmin(accountRootPrincipal);
                key.grantAdmin(this.deploymentRole);
                key.grantAdmin(this.crossAccountRole);

                key.grantEncryptDecrypt(accountRootPrincipal);
                key.grantEncryptDecrypt(this.deploymentRole);
                key.grantEncryptDecrypt(this.crossAccountRole);
            });

        props.artifactBucket.grantPut(accountRootPrincipal);
        props.artifactBucket.grantReadWrite(accountRootPrincipal);

        props.artifactBucket.grantPut(this.crossAccountRole);
        props.artifactBucket.grantReadWrite(this.crossAccountRole);

        props.artifactBucket.grantPut(this.deploymentRole);
        props.artifactBucket.grantReadWrite(this.deploymentRole);

    }
}