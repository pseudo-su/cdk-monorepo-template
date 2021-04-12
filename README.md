# CDK Monorepo Template

This repo is to experiment with having a NodeJS monorepo that contains multiple "service" packages that contain AWS CDK "apps" that can be packaged, versioned, published (as immutable artifacts) and deployed.

## Goals

- Support for packaging multiple "web services" from this monorepo where:
  - Everything will be packaged as CDK `app`s (made of cdk `construct`s and `stack`s)
  - Support creating immutable deployment artifacts (EG the opposite of [this](https://seed.run/blog/why-serverless-deployment-artifacts-cannot-be-reused-across-stages.html))
  - Uniform support for packages regardless of whether they "web apis" or "web sites"

## Quickstart

Install global dependencies:

- Install nvm
- Install rush

```sh
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash;

# Install rush
npm install -g @microsoft/rush;
```

Run project scripts

```sh
nvm use;

rush install;

rush build;

rush verify;

rush test;
```

## Packages

### Services

The packages within the `services/` folder contain web services. For our purposes a "service" is defined as a set of infastructure and code artifacts that combines together to culminate in something that exposes

- `@services/api-example`: Example service containing an AWS Lambda + API Gateway Web API.
- `@services/site-example-spa`: Example service containing a "Single Page App" (`SPA`) Web site (Using NextJS static export).
- `@services/site-example-ssr`: Example service containing a "Server Side Rendered" (`SSR`) Web site (Using NextJS serverless mode).

### Libraries

The packages within the `libs/` folder contain libraries used at runtime by other libraries or services.

- `@libs/api-common`: a set of re-usable utilities to assist in the creation of AWS Lambda + API Gateway Web API services.

### Tools

- `@tools/base-config-eslint`: Common base eslint rules and config to be used across all packages in this repository.
