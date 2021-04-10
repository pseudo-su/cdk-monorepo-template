import * as cdk from "@aws-cdk/core";
import { Builder } from "@sls-next/lambda-at-edge";
import { NextJSStack } from "./next-stack";

// Run the serverless builder, this could be done elsewhere in your workflow
const builder = new Builder(".", "./build", { args: ["build"] });

builder
  .build()
  .then(() => {
    const app = new cdk.App();
    new NextJSStack(app, `ExampleSiteSSRAppStack`, {});
  })
  .catch((error) => {
    console.log(error);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
