
import { Constants } from "../config/AppConstants";

export interface environmentProps{
    active: boolean
    accountId: string
    envType:string  
}

export class PipelineConstants {

    public devProps: environmentProps = {
        active: true,
        accountId: "285798802528",
        envType: "Dev",
    }  
    
    public testProps: environmentProps = {
        active: false,
        accountId: "983325150578",
        envType: "Test",   
    }  

    public prodProps: environmentProps = {
        active: false,
        accountId: "",
        envType: "Prod"
    }  

    public getRoleArn = (account: string, roleName: string) => {
        return `arn:aws:iam::${account}:role/${roleName}`
    }

    public cloudFormationRoleName = `${Constants.appName}-codepipeline-role`
    public codePipelineRoleName = `${Constants.appName}-cloudformation-role`
}