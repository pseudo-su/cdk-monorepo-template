import * as cdk from "@aws-cdk/core";
import { StaticSiteStack } from "./static-site";

const app = new cdk.App();
new StaticSiteStack(app, `ExampleSiteSPAAppStack`, {});
