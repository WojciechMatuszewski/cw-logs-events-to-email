#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CloudwatchLogsEmailStack } from "../lib/cloudwatch-logs-email-stack";

const app = new cdk.App();
new CloudwatchLogsEmailStack(app, "CloudwatchLogsEmailStack", {
  synthesizer: new cdk.DefaultStackSynthesizer({ qualifier: "help" })
});
