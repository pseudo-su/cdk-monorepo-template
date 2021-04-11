import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

type StaticSiteStackProps = cdk.StackProps;

export class StaticSiteStack extends cdk.Stack {
  private bucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);
    this.bucket = new s3.Bucket(this, `StaticSiteS3-${this.stackName}`);
  }
}
