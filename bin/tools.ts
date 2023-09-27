#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ToolsStack } from "../lib/tools-stack";
import { EnvFoundationsStack } from "../lib/foundations/env-foundations-stack";
import { Constants } from "../config/AppConstants";

const app = new cdk.App();

new EnvFoundationsStack(app, `FoundationsStack-${Constants.devProps.env}`, {
  env: { account: Constants.devProps.accountId, region: Constants.region },
  environment: Constants.devProps.env,
  description: `Creates the basic resources required to deploy cross-account`,
});

new EnvFoundationsStack(app, `FoundationsStack-${Constants.uatProps.env}`, {
  env: { account: Constants.uatProps.accountId, region: Constants.region },
  environment: Constants.uatProps.env,
  description: `Creates the basic resources required to deploy cross-account`,
});

new ToolsStack(app, "ToolsStack", {
  env: { account: Constants.toolsProps.accountId, region: Constants.region },
  environment: Constants.toolsProps.env,
  description: `Creates a tools pipleine to create the ${Constants.appName} app pipeline(s)`,
});

app.synth;
