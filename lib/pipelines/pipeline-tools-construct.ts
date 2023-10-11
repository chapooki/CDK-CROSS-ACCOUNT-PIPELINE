import { pipelines, SecretValue, aws_kms, aws_s3, RemovalPolicy, aws_iam } from 'aws-cdk-lib';
import { Constants } from "../../config/AppConstants";
import { Construct } from 'constructs';
import { ToolsPipelineFoundationsStage } from './pipeline-tools-foundations-stage';
import { ArtifactsConstruct } from '../foundations/artifacts-construct';

// TODO: Move the common code to a PipelineConstruct base class extending Construct
export class ToolsPipelineConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);  

    const gitHubPAT = SecretValue.secretsManager(`${Constants.appName}-github-pat`)

    // const artifactsKey = new aws_kms.Key(this, `ToolsArtifactsKey`, {      
    //   alias: `${Constants.appName}-artifacts-key`,
    // });

    // const artifactBucket = new aws_s3.Bucket(this, 'ToolsArtifactBucket', {
    //   bucketName: `${Constants.appName}-artifact-bucket`,
    //   removalPolicy: RemovalPolicy.DESTROY,
    //   encryption: aws_s3.BucketEncryption.KMS,
    //   encryptionKey: artifactsKey
    // });

    //   new ArtifactsConstruct(this, 'ToolsArtifactsConstruct', {
    //     environment: Constants.toolsProps,
    //     getRoleArn: Constants.getRoleArn,
    //     artifactsKeys: [artifactsKey],
    //     artifactBucket: artifactBucket
    //   });

    //   let role = aws_iam.Role.fromRoleArn(this, Constants.codePipelineRoleName,
    //     Constants.getRoleArn(Constants.toolsProps.accountId, Constants.codePipelineRoleName), {
    //     mutable: false
    // });
    
    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: `${Constants.appName}-ToolsPipeline`,
      // artifactBucket: artifactBucket,
      // role: role,
      crossAccountKeys: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('chapooki/CDK-CROSS-ACCOUNT-PIPELINE', 'master', {
          authentication: gitHubPAT,
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });    

    // const rolesInAllAccounts: string[] = Constants.getActivePropsList().map(p => `arn:aws:iam::${p.accountId}:role/*` );

    // pipeline.addToRolePolicy(new PolicyStatement({
    //   actions: ['sts:AssumeRole'],
    //   resources: [rolesInAllAccounts]
    // }));

    const activeEnv = Constants.getActivePropsList();
    activeEnv.forEach(env => {

      // new ArtifactsConstruct(this, `${actibeEnv}`ArtifactsConstruct`, {
      //   environment: environmentValues.devProps,
      //   getRoleArn: environmentValues.getRoleArn,
      //   artifactsKeys: [artifactsKey],
      //   artifactBucket: artifactBucket
      // });
      
      pipeline.addStage(new ToolsPipelineFoundationsStage(this, "FoundationsStage", {
        env: { account: env.accountId, region: Constants.region }
      }));
    });
  }
}
