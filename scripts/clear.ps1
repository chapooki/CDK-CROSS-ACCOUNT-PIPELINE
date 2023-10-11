# Define environment variables
# TODO: read from AppConstants
$appName = "naz-devenv"
$region = "ap-southeast-2"
$toolsAccountId = "937239801448"
$devAccountId = "285798802528"
$toolsAccountProfile = "default"
$devAccountProfile = "naz.aws.05092023.dev"
$bootstrapAccountScriptPath = ".\tools\scripts\bootstrapAccount.ps1"

aws cloudformation delete-stack --stack-name CDKToolkit --profile $toolsAccountProfile
aws cloudformation delete-stack --stack-name CDKToolkit --profile $devAccountProfile

aws cloudformation delete-stack --stack-name ToolsStack --profile $toolsAccountProfile
aws cloudformation delete-stack --stack-name ToolsStack  --profile $devAccountProfile