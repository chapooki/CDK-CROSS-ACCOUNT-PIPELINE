import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EncryptionConstruct } from './encryption';
import {
  ToolsPipelineConstruct,
} from './pipelines';
import { Constants } from "../config/AppConstants";

export interface ToolsStackProps extends StackProps {
  environment: string
}

export class ToolsStack extends Stack {
  constructor(scope: Construct, id: string, props: ToolsStackProps) {
    super(scope, id, props);
    // NOT sure if it's used in the new cdk version
    // new EncryptionConstruct(this, `${Constants.appName}EncryptionKey`);
    new ToolsPipelineConstruct(this, `${Constants.appName}ToolsPipeline`);
  }
}
