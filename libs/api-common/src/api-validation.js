"use strict";

const Boom = require("@hapi/boom");

const CloudfrontHeaders = Object.freeze({
  DESKTOP_VIEWER: "CloudFront-Is-Desktop-Viewer",
  MOBILE_VIEWER: "CloudFront-Is-Mobile-Viewer",
  SMARTTV_VIEWER: "CloudFront-Is-SmartTV-Viewer",
  TABLET_VIEWER: "CloudFront-Is-Tablet-Viewer",
  VIEWER_COUNTRY: "CloudFront-Viewer-Country",
});

function decodeHeaders(headers, base64Headers) {
  const decodedHeaders = base64Headers
    .map((headerKey) => {
      const headerContent =
        headers[headerKey] || headers[headerKey.toLowerCase()];
      if (!headerContent) {
        throw new Error(`Unable to find header ${headerKey}`);
      }
      const headerValue = Buffer.from(headerContent, "base64");
      return { key: headerKey, value: headerValue.toString("utf8") };
    })
    .reduce((acc, item) => {
      const { key, value } = item;
      return Object.assign(acc, { [key]: value });
    }, {});

  return Object.assign({}, headers, decodedHeaders);
}

async function extractApiInputFromEvent(
  { event = null },
  {
    base64Decode = false,
    base64Headers = [],
    extractIdentity = false,
    extractRequestMeta = false,
  } = {},
) {
  if (!event) throw Boom.badImplementation();
  const httpMethod = event.httpMethod;
  const shouldHaveBody = ["PUT", "POST"].includes(httpMethod);
  if (shouldHaveBody && !event.body) {
    throw Boom.badRequest("Request body required");
  }

  const bodyToAssign = shouldHaveBody ? { body: JSON.parse(event.body) } : {};

  const identityToAssign = extractIdentity
    ? { identity: extractIdentityFromEvent(event) }
    : {};
  const requestToAssign = extractRequestMeta
    ? { requestMeta: extractRequestMetaFromEvent(event) }
    : {};

  // Path params take precedence (override) over query string params
  const params = Object.assign(
    {},
    event.queryStringParameters,
    event.pathParameters,
  );

  // could possibly change all keys to lower case instead of adding more keys
  for (const key in event.headers) {
    event.headers[key.toLowerCase()] = event.headers[key];
  }

  const headers = base64Decode
    ? decodeHeaders(event.headers, base64Headers)
    : event.headers;

  const extractedValues = Object.assign(
    { params, headers },
    bodyToAssign,
    identityToAssign,
    requestToAssign,
  );
  return extractedValues;
}

function boolFromHeader(headerVal) {
  if (typeof headerVal !== "string") return null;
  return headerVal === "true";
}

function strFromHeader(headerVal) {
  if (typeof headerVal !== "string") return null;
  return headerVal;
}

function extractIdentityFromEvent(event) {
  const context = event.requestContext.identity;
  const identityFromEventContext = {
    cognitoIdentityPoolId: context.cognitoIdentityPoolId,
    cognitoIdentityId: context.cognitoIdentityId,
    apiKey: context.apiKey,
    cognitoAuthenticationType: context.cognitoAuthenticationType,
    userArn: context.userArn,
    apiKeyId: context.apiKeyId,
    userAgent: context.userAgent,
    accountId: context.accountId,
    caller: context.caller,
    sourceIp: context.sourceIp,
    accessKey: context.accessKey,
    cognitoAuthenticationProvider: context.cognitoAuthenticationProvider,
    user: context.user,
  };

  const headers = event.headers;
  const isDesktopViewer = boolFromHeader(
    headers[CloudfrontHeaders.DESKTOP_VIEWER],
  );
  const isMobileViewer = boolFromHeader(
    headers[CloudfrontHeaders.MOBILE_VIEWER],
  );
  const isSmartTVViewer = boolFromHeader(
    headers[CloudfrontHeaders.SMARTTV_VIEWER],
  );
  const isTabletViewer = boolFromHeader(
    headers[CloudfrontHeaders.TABLET_VIEWER],
  );
  const viewerCountry = strFromHeader(
    headers[CloudfrontHeaders.VIEWER_COUNTRY],
  );

  const someChannel =
    headers["Some-Channel"] || headers["some-channel"] || null;

  const somePlatform =
    headers["Some-Platform"] || headers["some-platform"] || null;

  const identityFromHeaders = {
    isDesktopViewer,
    isMobileViewer,
    isSmartTVViewer,
    isTabletViewer,
    viewerCountry,
    someChannel,
    somePlatform,
  };

  return Object.assign(identityFromEventContext, identityFromHeaders);
}

function extractRequestMetaFromEvent(event) {
  const requestContext = event.requestContext;
  return {
    resourceId: requestContext.resourceId,
    resourcePath: requestContext.resourcePath,
    httpMethod: requestContext.httpMethod,
    requestId: requestContext.requestId,
    extendedRequestId: requestContext.extendedRequestId,
    requestTime: requestContext.requestTime,
    requestTimeEpoch: requestContext.requestTimeEpoch,
    protocol: requestContext.protocol,
  };
}

async function validateApiInput(objectToValidate, schema) {
  const { error, value } = schema.validate(objectToValidate);
  if (error) {
    const errorDescriptions = error.details.map((detail) => detail.message);
    const primaryMsg =
      errorDescriptions.find(Boolean) || "Request Validation Failed";
    throw Boom.badRequest(primaryMsg, { errors: errorDescriptions });
  }
  return value;
}

module.exports = {
  extractApiInputFromEvent,
  validateApiInput,
};
