export interface environmentProps{
    accountId: string
    env:string
}

export class Constants {
    static readonly appName = "naz-devenv";
    static readonly region = "ap-southeast-2";
    static readonly codePipelineRoleName = `${this.appName}-codepipeline-role`;
    static readonly cloudFormationRoleName = `${this.appName}-cloudformation-role`;

    static readonly toolsProps: environmentProps = {
        accountId: "937239801448",
        env: "Tools"
    }  

    static readonly devProps: environmentProps = {
        accountId: "285798802528",
        env: "Dev"
    }  
    
    static readonly uatProps: environmentProps = {
        accountId: "983325150578",
        env: "UAT"       
    }  

    static readonly getRoleArn = (account: string, roleName: string) => {
        return `arn:aws:iam::${account}:role/${roleName}`
    }
}