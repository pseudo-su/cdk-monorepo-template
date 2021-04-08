import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import * as cdk from "@aws-cdk/core";
import { HostedZone } from "@aws-cdk/aws-route53";
import { Certificate } from "@aws-cdk/aws-certificatemanager";

export class NextStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    new NextJSLambdaEdge(this, "NextJsApp", {
      serverlessBuildOutDir: "./build",
    });
  }
}
