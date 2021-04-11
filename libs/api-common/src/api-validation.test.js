"use strict";

const test = require("ava");
const { extractApiInputFromEvent } = require("./api-validation");

const base64EncodedHeader = () =>
  Buffer.from('{"foo": "we will decode this"}', "utf8").toString("base64");

const defaultValidHttpEvent = ({
  httpMethod = "GET",
  body = {},
  queryStringParameters = {},
  pathParameters = {},
  headers,
} = {}) => ({
  headers: headers ? headers : { Authorization: "Bearer blah" },
  httpMethod,
  body: ["PUT", "POST"].includes(httpMethod) ? JSON.stringify(body) : undefined,
  queryStringParameters,
  pathParameters,
  requestContext: {
    resourceId: "v6049a",
    resourcePath: "/account/info",
    httpMethod: "GET",
    extendedRequestId: "GVaBlFitywMFeSQ=",
    requestTime: "04/May/2018:00:04:51 +0000",
    path: "/john/account/info",
    accountId: "444484274653",
    protocol: "HTTP/1.1",
    stage: "john",
    requestTimeEpoch: 1525392291762,
    requestId: "c470d985-4f2e-11e8-9df8-231639238d2b",
    identity: {
      cognitoIdentityPoolId: null,
      cognitoIdentityId: null,
      apiKey: "9Bkzi98kIN3szWGdyt27R89CyduxQUJV1lHaaKEG",
      cognitoAuthenticationType: null,
      userArn: null,
      apiKeyId: "cmycsptste",
      userAgent: "PostmanRuntime/7.1.1",
      accountId: null,
      caller: null,
      sourceIp: "1.152.108.11",
      accessKey: null,
      cognitoAuthenticationProvider: null,
      user: null,
    },
    apiId: "cdo0rat6wj",
  },
});

test("extractApiInputFromEvent GET", async (t) => {
  const fixture = defaultValidHttpEvent({
    queryStringParameters: { foo: "bar", test: "ignorethis" },
    pathParameters: { someCode: "MONEY_SINK", test: "includethis" },
  });
  const httpInput = await extractApiInputFromEvent({ event: fixture });
  t.deepEqual(httpInput, {
    params: {
      test: "includethis",
      foo: "bar",
      someCode: "MONEY_SINK",
    },
    headers: {
      Authorization: "Bearer blah",
      authorization: "Bearer blah",
    },
  });
});

test("extractApiInputFromEvent PUT", async (t) => {
  const transactionId = "123-123-123-123";
  const fixture = defaultValidHttpEvent({
    httpMethod: "PUT",
    body: { transactionId },
  });
  const httpInput = await extractApiInputFromEvent({ event: fixture });
  t.deepEqual(httpInput, {
    params: {},
    body: { transactionId },
    headers: {
      Authorization: "Bearer blah",
      authorization: "Bearer blah",
    },
  });
});

test("extractApiInputFromEvent POST", async (t) => {
  const fixture = defaultValidHttpEvent({ httpMethod: "POST" });
  const httpInput = await extractApiInputFromEvent({ event: fixture });
  t.deepEqual(httpInput, {
    params: {},
    body: {},
    headers: {
      Authorization: "Bearer blah",
      authorization: "Bearer blah",
    },
  });
});

test("extractApiInputFromEvent base64 decode headers", async (t) => {
  const extractConfig = {
    base64Decode: true,
    base64Headers: ["Some-Authorization"],
  };

  const validFixture = defaultValidHttpEvent({
    queryStringParameters: { foo: "bar", test: "ignorethis" },
    pathParameters: { someCode: "MONEY_SINK", test: "includethis" },
  });

  validFixture.headers["Some-Authorization"] = base64EncodedHeader();

  const expectedParams = {
    test: "includethis",
    foo: "bar",
    someCode: "MONEY_SINK",
  };
  const expectedHeaders = {
    Authorization: "Bearer blah",
    "Some-Authorization": '{"foo": "we will decode this"}',
    authorization: "Bearer blah",
    "some-authorization": "eyJmb28iOiAid2Ugd2lsbCBkZWNvZGUgdGhpcyJ9",
  };

  const httpInput = await extractApiInputFromEvent(
    { event: validFixture },
    extractConfig,
  );

  t.deepEqual(httpInput, {
    params: expectedParams,
    headers: expectedHeaders,
  });
});

test("extractApiInputFromEvent throws header not found", async (t) => {
  const extractConfig = {
    base64Decode: true,
    base64Headers: ["Some-Authorization"],
  };
  const invalidFixture = defaultValidHttpEvent();

  await t.throws(
    extractApiInputFromEvent({ event: invalidFixture }, extractConfig),
    "Unable to find header Some-Authorization",
  );
});

test("extractApiInputFromEvent base64 decode headers case insensitive", async (t) => {
  const extractConfig = {
    base64Decode: true,
    base64Headers: ["Some-Authorization"],
  };

  const validFixture2 = defaultValidHttpEvent();

  validFixture2.headers["some-authorization"] = base64EncodedHeader();

  const expectedParams = {};
  const expectedHeaders = {
    Authorization: "Bearer blah",
    authorization: "Bearer blah",
    "Some-Authorization": '{"foo": "we will decode this"}',
    "some-authorization": "eyJmb28iOiAid2Ugd2lsbCBkZWNvZGUgdGhpcyJ9",
  };

  const httpInput2 = await extractApiInputFromEvent(
    { event: validFixture2 },
    extractConfig,
  );

  t.deepEqual(httpInput2, {
    params: expectedParams,
    headers: expectedHeaders,
  });
});

test("extractApiInputFromEvent should extract identity from AWS", async (t) => {
  const fixture = defaultValidHttpEvent({
    queryStringParameters: {},
    pathParameters: {},
    headers: {
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      // 'CloudFront-Is-SmartTV-Viewer': 'true',
      "CloudFront-Is-Tablet-Viewer": "true",
      "CloudFront-Viewer-Country": "AU",
      "Some-Channel": "ourwebsite",
      "Some-Platform": "ios",
    },
  });
  const httpInput = await extractApiInputFromEvent(
    { event: fixture },
    { extractIdentity: true },
  );
  t.deepEqual(httpInput, {
    params: {},
    headers: {
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "true",
      "CloudFront-Viewer-Country": "AU",
      "Some-Channel": "ourwebsite",
      "Some-Platform": "ios",
      "cloudfront-is-desktop-viewer": "true",
      "cloudfront-is-mobile-viewer": "false",
      "cloudfront-is-tablet-viewer": "true",
      "cloudfront-viewer-country": "AU",
      "some-channel": "ourwebsite",
      "some-platform": "ios",
    },
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: "9Bkzi98kIN3szWGdyt27R89CyduxQUJV1lHaaKEG",
      apiKeyId: "cmycsptste",
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      isDesktopViewer: true,
      isMobileViewer: false,
      isSmartTVViewer: null,
      isTabletViewer: true,
      someChannel: "ourwebsite",
      somePlatform: "ios",
      sourceIp: "1.152.108.11",
      user: null,
      userAgent: "PostmanRuntime/7.1.1",
      userArn: null,
      viewerCountry: "AU",
    },
  });
});

test("extractApiInputFromEvent should extract request metadata from AWS", async (t) => {
  const fixture = defaultValidHttpEvent({
    queryStringParameters: {},
    pathParameters: {},
    headers: {},
  });
  const httpInput = await extractApiInputFromEvent(
    { event: fixture },
    { extractRequestMeta: true },
  );
  t.deepEqual(httpInput, {
    params: {},
    headers: {},
    requestMeta: {
      extendedRequestId: "GVaBlFitywMFeSQ=",
      httpMethod: "GET",
      protocol: "HTTP/1.1",
      requestId: "c470d985-4f2e-11e8-9df8-231639238d2b",
      requestTime: "04/May/2018:00:04:51 +0000",
      requestTimeEpoch: 1525392291762,
      resourceId: "v6049a",
      resourcePath: "/account/info",
    },
  });
});
