export interface environmentProps {
  active: boolean;
  accountId: string;
  env: string;
}

export class Constants {
  static readonly appName = "naz-devenv";
  static readonly region = "ap-southeast-2";
  static readonly codePipelineRoleName = `${this.appName}-codepipeline-role`;
  static readonly cloudFormationRoleName = `${this.appName}-cloudformation-role`;

  public getProps = (envType: string) => {
    envType = envType.toLowerCase();
    switch (envType) {
      case "dev":
      case "development":
        return Constants.devProps;
      case "test":
      case "uat":
        return Constants.uatProps;
      case "prod":
      case "production":
        return Constants.prodProps;
      default:
        return Constants.devProps;
    }
  };

  static readonly toolsProps: environmentProps = {
    active: true,
    accountId: "937239801448",
    env: "Tools",
  };

  static readonly devProps: environmentProps = {
    active: true,
    accountId: "285798802528",
    env: "Dev",
  };

  static readonly uatProps: environmentProps = {
    active: false,
    accountId: "983325150578",
    env: "UAT",
  };

  static readonly prodProps: environmentProps = {
    active: false,
    accountId: "",
    env: "Prod",
  };

  static getActivePropsList = () => {
    let result: environmentProps[] = [];
    if (this.devProps.active) result.push(this.devProps);
    if (this.uatProps.active) result.push(this.uatProps);
    if (this.prodProps.active) result.push(this.prodProps);
    return result;
  } 

  static readonly getRoleArn = (account: string, roleName: string) => {
    return `arn:aws:iam::${account}:role/${roleName}`;
  };
}
