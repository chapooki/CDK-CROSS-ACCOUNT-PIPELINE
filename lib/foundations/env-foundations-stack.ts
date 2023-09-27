import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EnvTeamPermissionsConstruct } from './env-team-permissions-construct';

export interface RolesStackProps extends StackProps {
  environment: string
}

/// to create the resources like roles required to run pipelines cross-account
export class EnvFoundationsStack extends Stack {
  constructor(scope: Construct, id: string, props: RolesStackProps) {
    super(scope, id, props);
      new EnvTeamPermissionsConstruct(this, `TeamPermissions`);    
  }
}
