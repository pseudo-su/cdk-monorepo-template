import * as cdk from "@aws-cdk/core";
import { Builder } from "@sls-next/lambda-at-edge";
import { NextStack } from "./next-stack";

// Run the serverless builder, this could be done elsewhere in your workflow
const builder = new Builder(".", "./build", { args: ["build"] });

builder
  .build()
  .then(() => {
    const app = new cdk.App();
    new NextStack(app, `NextStack`, {});
  })
  .catch((error) => {
    console.log(error);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  });
