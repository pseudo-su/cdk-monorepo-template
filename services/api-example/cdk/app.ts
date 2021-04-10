import "source-map-support/register";
import cdk = require("@aws-cdk/core");
import { LambdaApiStack } from "./api-stack";

export const stackName = "ExampleAPIAppStack";

const app = new cdk.App();

new LambdaApiStack(app, stackName, {});
