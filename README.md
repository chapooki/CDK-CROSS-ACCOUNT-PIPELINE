# init
- Create and use git repositories instead of codeCommit
- In the console of the management/tools accont: Enable IAM Identity center, create/add multiple aws accounts to the organisation: Tool/management, dev, uat, prod
- In each environment account (Dev/UAT/Prod), create a local admin user with cli access keys to deploy the foundations stack.
- Run the boostrap.ps1 script from the root folder

## TODO:
 - FoundationsStack => Remove from lib => deploy to env accounts using a pipeline
 - artifacts? => create from each pipeline for that pipeline
 - ConfigConstruct => not used yet
 - EncryptionConstruct => called from ToolsStack => maybe break to single account and leave the accounts as pipeline stages
 - Replace CodeCommit with git repo


- Create Admin and Developer Groups 
- Add the list of users to each user group
- Assign PermissionSets to user groups:
   - Admin: {appName}-admin-access-policy
   - Developer: {appName}-developer-access-policy



