# init
- Set AppConstants and values variables
- Create and use git repositories instead of codeCommit. Create an GitHub access token. Go to your Account Settings (not repository settings), Developer Settings, then Personal access tokens.
At this menu, select Generate new token to be taken to the new access token creation menu. Enter a descriptive note and select the repo and admin:repo_hook scopes. This will give AWS the required permissions to create a webhook for detecting new commits and reading the repository in CodePipeline. Generate the token and you’ll see the generated access token string, be sure to copy this because this is what we’ll be storing in AWS Secrets Manager.
Then navigate to Secrets Manager in the Tools account AWS console and select Store a new secret. You’ll be prompted to select a secret type, select Other type of secrets. Under “Specify the key/value pairs to be stored in this secret”, select Plaintext and paste in the access token and save it as "{appName}-github-pat"

- In the console of the management/tools accont: Enable IAM Identity center, create/add multiple aws accounts to the organisation: Tool/management, dev, uat, prod
- In each environment account (Dev/UAT/Prod), create a local admin user with cli access keys to deploy the foundations stack.
- Run the boostrap.ps1 script from the root folder
- 

## TODO:
 - FoundationsStack => Removed from lib => deploy to env accounts using a pipeline
 - ConfigConstruct => not used yet
 - EncryptionConstruct => called from ToolsStack => maybe break to single account and leave the accounts as pipeline stages
 - Replace CodeCommit with git repo
 - Team permission: developers need a different level of access in each account. But currently, we have the same level of access everywhere

 ##NOTE
 - create ArtifactsConstruct in every pipeline construct


- Create Admin and Developer Groups 
- Add the list of users to each user group
- Assign PermissionSets to user groups:
   - Admin: {appName}-admin-access-policy
   - Developer: {appName}-developer-access-policy



