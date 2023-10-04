import { aws_kms, aws_s3, aws_iam} from 'aws-cdk-lib';
import { Constants, environmentProps } from "../../config/AppConstants";
import { Construct } from 'constructs';

export interface Props {
    environment: environmentProps,
    getRoleArn: (account: string, roleName: string) => string,
    artifactsKeys: aws_kms.Key[],
    artifactBucket: aws_s3.Bucket
}

export class ArtifactsConstruct extends Construct {

    public deploymentRole: aws_iam.IRole;
    public crossAccountRole: aws_iam.IRole;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.deploymentRole = aws_iam.Role.fromRoleArn(this, `DeploymentRole`,
            props.getRoleArn(props.environment.accountId, Constants.cloudFormationRoleName), {
            mutable: false
        });

        this.crossAccountRole = aws_iam.Role.fromRoleArn(this, `CrossAccountRole`,
            props.getRoleArn(props.environment.accountId, Constants.codePipelineRoleName), {
            mutable: false
        });

        const accountRootPrincipal = new aws_iam.AccountPrincipal(props.environment.accountId);

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