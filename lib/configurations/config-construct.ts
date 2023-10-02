import { aws_ssm } from 'aws-cdk-lib';
import { Constants } from "../../config/AppConstants";
import { Construct } from 'constructs';

export interface ConfigurationConstructProps {
  readonly name?: string,
  readonly value?: string
}

/// Question - where is it used?
export class ConfigurationConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ConfigurationConstructProps = {}) {
    super(scope, id);

    if (props && props.name && props.value) {
      new aws_ssm.StringParameter(this, `${Constants.appName}StringParameter`, {
        description: `created for ${Constants.appName} application to store ${props.name} parameter`,
        parameterName: `${props.name}`,
        stringValue: `${props.value}`
      });
    }
  }
}