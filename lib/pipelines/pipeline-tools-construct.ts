import { pipelines, SecretValue } from 'aws-cdk-lib';
import { Constants } from "../../config/AppConstants";
import { Construct } from 'constructs';

export class ToolsPipelineConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);  

    const gitHubPAT = SecretValue.secretsManager(`${Constants.appName}-github-pat`)

    console.log(`gitHubPAT=${gitHubPAT}`) 

    new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: `${Constants.appName}-ToolsPipeline`,
      crossAccountKeys: false,     
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub('chapooki/CDK-CROSS-ACCOUNT-PIPELINE', 'master', {
          // This is optional
          authentication: gitHubPAT,
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });
  }
}
