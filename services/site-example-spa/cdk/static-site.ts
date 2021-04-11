import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";

type StaticSiteStackProps = cdk.StackProps;

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(
      this,
      `WebsiteBucket-${this.stackName}`,
      {
        websiteIndexDocument: "index.html",
        publicReadAccess: true,
      },
    );

    // Handles buckets whether or not they are configured for website hosting.
    const distribution = new cloudfront.Distribution(
      this,
      `Distribution-${this.stackName}`,
      {
        defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
      },
    );

    new s3deploy.BucketDeployment(this, `DeployWebsite-${this.stackName}`, {
      sources: [s3deploy.Source.asset("./out")],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: "/",
      distribution,
      distributionPaths: ["/images/*.png"],
    });
  }
}
