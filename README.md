# CDK Monorepo Template

This repo is to experiment with having a NodeJS monorepo that contains multiple "service" packages that contain AWS CDK "apps" that can be packaged, versioned, published (as immutable artifacts) and deployed.

## Goals

- Support for packaging multiple "web services" from this monorepo where:
  - Everything will be packaged as CDK `app`s (made of cdk `construct`s and `stack`s)
  - Support creating immutable deployment artifacts (EG the opposite of [this](https://seed.run/blog/why-serverless-deployment-artifacts-cannot-be-reused-across-stages.html))
  - Uniform support for packages regardless of whether they "web apis" or "web sites"
