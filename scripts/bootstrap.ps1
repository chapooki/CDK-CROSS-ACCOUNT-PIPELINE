# Define environment variables
# TODO: read from AppConstants
$appName = "naz-devenv"
$region = "ap-southeast-2"
$toolsAccountId = "937239801448"
$devAccountId = "285798802528"
$toolsAccountProfile = "default"
$devAccountProfile = "naz.aws.05092023.dev"
$bootstrapAccountScriptPath = ".\tools\scripts\bootstrapAccount.ps1"

# Bootstrap Tools Account
$bootstrapArgumentList = @()
$bootstrapArgumentList += ("-appName", "`"$appName`"")
$bootstrapArgumentList += ("-region", "`"$region`"")
$bootstrapArgumentList += ("-env", "`"Tools`"")
$bootstrapArgumentList += ("-toolsAccountId", "`"$toolsAccountId`"")
$bootstrapArgumentList += ("-targetAccountId", "`"$toolsAccountId`"")
$bootstrapArgumentList += ("-targetAccountProfile", "`"$toolsAccountProfile`"")

Write-Host "calling boostrap for Tools account with arguments list = $($bootstrapArgumentList)"
Invoke-Expression "& `"$bootstrapAccountScriptPath`" $bootstrapArgumentList"

# TODO: loop thru env in AppConstants
# Bootstrap Dev Account
$bootstrapArgumentList = @()
$bootstrapArgumentList += ("-appName", "`"$appName`"")
$bootstrapArgumentList += ("-region", "`"$region`"")
$bootstrapArgumentList += ("-env", "`"Dev`"")
$bootstrapArgumentList += ("-toolsAccountId", "`"$toolsAccountId`"")
$bootstrapArgumentList += ("-targetAccountId", "`"$devAccountId`"")
$bootstrapArgumentList += ("-targetAccountProfile", "`"$devAccountProfile`"")

Write-Host "calling boostrap for Dev account with arguments list = $($bootstrapArgumentList)"
Invoke-Expression "& `"$bootstrapAccountScriptPath`" $bootstrapArgumentList"