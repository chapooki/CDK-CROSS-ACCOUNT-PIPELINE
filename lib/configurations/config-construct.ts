import * as cdk from '@aws-cdk/core';
import ssm = require('@aws-cdk/aws-ssm');
import { Constants } from "../../config/AppConstants";

export interface ConfigurationConstructProps {
  readonly name?: string,
  readonly value?: string
}

export class ConfigurationConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ConfigurationConstructProps = {}) {
    super(scope, id);

    if (props && props.name && props.value) {
      new ssm.StringParameter(this, `${Constants.appName}StringParameter`, {
        description: `created for ${Constants.appName} application to store ${props.name} parameter`,
        parameterName: `${props.name}`,
        stringValue: `${props.value}`
      });
    }
  }
}