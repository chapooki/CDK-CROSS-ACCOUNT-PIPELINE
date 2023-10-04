import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TeamPermissionsConstruct } from './team-permissions-construct';

export interface Props extends StackProps {
  environment: string
}

/// to create the resources like roles required to run pipelines cross-account
export class FoundationsStack extends Stack {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);
      new TeamPermissionsConstruct(this, `TeamPermissions`);    
  }
}
