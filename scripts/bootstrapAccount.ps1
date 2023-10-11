param (
  [Parameter()]
  [string]$appName,

  [Parameter()]
  [string]$region,

  [Parameter()]
  [string]$env,

  [Parameter()]
  [string]$toolsAccountId,

  [Parameter()]
  [string]$targetAccountId,

  [Parameter()]
  [string]$targetAccountProfile,

  [Parameter()]
  [string]$cloudformationExecutionPolicies
)

Write-Host "================================================================="
Write-Host "Bootstrapping $($env) account..."

# commented out as it seems like the new CDK pipeline has covered this in background
# # Deploy the policies required to be used by CDK bootstrap
# $JsonParameter = @(
#   @{
#     ParameterKey   = 'ToolsAccountId'
#     ParameterValue = $toolsAccountId
#   },
#   @{
#     ParameterKey   = 'Region'
#     ParameterValue = $region
#   },
#   @{
#     ParameterKey   = 'AppName'
#     ParameterValue = $appName
#   }
# ) 
# $JsonParameterString = $JsonParameter | Convertto-json -Compress

# ## Deployment
# Write-Host "Creating the bootstrapPolicies stack in $($env) account..."
# $bootstrapPoliciesStackId = 
# aws cloudformation create-stack `
#   --stack-name "bootstrap-policies" `
#   --template-body "file://tools/cloud-formation/env-bootstrap-policies.yaml" `
#   --parameters $JsonParameterString `
#   --capabilities CAPABILITY_NAMED_IAM `
#   --profile $targetAccountProfile `
#   --output text

# ## Wait for the stack to exist
# aws cloudformation wait stack-create-complete --profile $targetAccountProfile --stack-name $bootstrapPoliciesStackId

## Output the result of the create-stack command
# Write-Host "The bootstrapPolicies stack was created. StackId = $bootstrapPoliciesStackId"

# Bootstrap CDK
# $cloudformationExecutionPolicies = "arn:aws:iam::$($targetAccountId):policy/$($appName)-cloudformation-policy";
# if ($targetAccountId -eq $toolsAccountId){
   $cloudformationExecutionPolicies = "arn:aws:iam::aws:policy/AdministratorAccess";
# }

Write-Host "CDK bootstraping"
cdk bootstrap $targetAccountId/$region `
  --no-bootstrap-customer-key `
  --trust $toolsAccountId `
  --trust-for-lookup $toolsAccountId `
  --cloudformation-execution-policies $cloudformationExecutionPolicies `
  --profile $targetAccountProfile  
