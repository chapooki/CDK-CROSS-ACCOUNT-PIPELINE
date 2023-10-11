# init
- Set AppConstants variables
- Create and use git repositories instead of codeCommit. Create an GitHub access token. Go to your Account Settings (not repository settings), Developer Settings, then Personal access tokens.
At this menu, select Generate new classic token to be taken to the new access token creation menu. Enter a descriptive note and select the repo and admin:repo_hook scopes. This will give AWS the required permissions to create a webhook for detecting new commits and reading the repository in CodePipeline. Generate the token and you’ll see the generated access token string, be sure to copy this because this is what we’ll be storing in AWS Secrets Manager.
Then navigate to Secrets Manager in the Tools account AWS console and select Store a new secret. You’ll be prompted to select a secret type, select Other type of secrets. Under “Specify the key/value pairs to be stored in this secret”, select Plaintext and paste in the access token and save it as "{appName}-github-pat"

- In the console of the management/tools accont: Enable IAM Identity center, create/add multiple aws accounts to the organisation: Tool/management, dev, uat, prod
- In each environment account (Dev/UAT/Prod), create a local admin user with cli access keys to deploy the foundations stack.
- Run the boostrap.ps1 script from the root folder to bootstrap the accounts
- Deploy the pipelines using deployPipelines.ps1 script from tools folder
- [TO BE CONFIRMED] Administrative permissions to the account are only necessary up until this point. We recommend you remove access to these credentials after doing this.



- Create Admin and Developer Groups 
- Add the list of users to each user group
- Assign PermissionSets to user groups:
   - Admin: {appName}-admin-access-policy
   - Developer: {appName}-developer-access-policy
- Give user groups access to the environment and tools accounts using the defined permission sets. 



## TODO:
- Limit access by setting --cloudformation-execution-policies in cdk bootstrap
- Team permission: developers need a different level of access in each account. But currently, we have the same level of access everywhere

## NOTE
- We use CDK Pipelines from aws-cdk-lib.pipelines instead of aws-cdk-lib.aws_codepipeline as it has simplified the definition of cross account deployment, and although it has limitations, we do not need those features. Read more here: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
