# Define environment variables
$appName = "naz-devenv"
$region = "ap-southeast-2"
$toolAccountId = "937239801448"
$devAccountId = "285798802528"
$toolAccountProfile = "default"
$devAccountProfile = "naz.aws.05092023.dev"

# Deploy the policies required to be used by CDK bootstrap
$JsonParameter = @(
  @{
    ParameterKey   = 'ToolsAccountId'
    ParameterValue = $toolAccountId
  },
  @{
    ParameterKey   = 'Region'
    ParameterValue = $region
  },
  @{
    ParameterKey   = 'AppName'
    ParameterValue = $appName
  }
) 
$JsonParameterString = $JsonParameter | Convertto-json -Compress
Write-Host "Creating the bootstrapPolicies stack..."
$bootstrapPoliciesStackId = 
  aws cloudformation create-stack `
    --stack-name "bootstrap-policies" `
    --template-body "file://tools/cloud-formation/env-bootstrap-policies.yaml" `
    --parameters $JsonParameterString `
    --capabilities CAPABILITY_NAMED_IAM `
    --profile $devAccountProfile `
    --output text

# Wait for the stack to exist
aws cloudformation wait stack-create-complete --profile $devAccountProfile --stack-name $bootstrapPoliciesStackId

# Output the result of the create-stack command
Write-Host "The bootstrapPolicies stack was created. StackId = $bootstrapPoliciesStackId"

# Bootstrap
Write-Host "CDK bootstraping"
cdk bootstrap $devAccountId/$region `
--no-bootstrap-customer-key `
--cloudformation-execution-policies "arn:aws:iam::$($devAccountId):policy/$($appName)-cloudformation-policy" `
--trust $toolAccountId `
--trust-for-lookup $toolAccountId `
--profile $devAccountProfile