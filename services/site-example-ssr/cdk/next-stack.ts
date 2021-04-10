import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import * as cdk from "@aws-cdk/core";
// import { HostedZone } from "@aws-cdk/aws-route53";
// import { Certificate } from "@aws-cdk/aws-certificatemanager";

export class NextJSStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    new NextJSLambdaEdge(this, `NextJSLambdaEdge-${this.stackName}`, {
      serverlessBuildOutDir: "./build",
      // domain: {
      //   domainName: "cdk-example-ssr.superlegit.business",
      //   hostedZone: HostedZone.fromHostedZoneAttributes(this, "Zone", {
      //     hostedZoneId: "XXXXXXXXXX",
      //     zoneName: "superlegit.business",
      //   }),
      //   certificate: Certificate.fromCertificateArn(
      //     this,
      //     "Cert",
      //     "arn:aws:acm:us-east-1:XXXXXXXXXX:certificate/XXXXXXXXXX",
      //   ),
      // },
    });
  }
}
