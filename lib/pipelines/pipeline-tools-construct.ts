import * as cdk from '@aws-cdk/core';
import codecommit = require('@aws-cdk/aws-codecommit');
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { SimpleSynthAction, CdkPipeline } from "@aws-cdk/pipelines";
import { Constants } from "../../config/AppConstants";
// import * as ssm from '@aws-cdk/aws-ssm';

export class ToolsPipelineConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const toolsRepo = new codecommit.Repository(this, 'CodeCommitRepo', {
      repositoryName: `${Constants.appName}-tools-repo`
    });

    const sourceArtifact = new codepipeline.Artifact();     
    const cloudAssemblyArtifact = new codepipeline.Artifact();    

    new CdkPipeline(this, "Pipeline", {
      pipelineName: `${Constants.appName}-ToolsPipeline`,
      crossAccountKeys: false,      
      cloudAssemblyArtifact,     

      sourceAction: new codepipeline_actions.CodeCommitSourceAction({
        actionName: 'CodeCommit',
        output: sourceArtifact,
        repository: toolsRepo
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,        
        cloudAssemblyArtifact,
        buildCommand: 'npm run build',        
      })
    });
  }
}
