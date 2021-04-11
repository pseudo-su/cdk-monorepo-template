"use strict";

const test = require("ava");
const { ApiResponse } = require("./api-response");
const Boom = require("@hapi/boom");

const defaultHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-cache",
});

test("build default response", (t) => {
  const resp1 = new ApiResponse().build();
  const expected = {
    statusCode: 200,
    body: "{}",
    headers: defaultHeaders(),
  };
  t.deepEqual(resp1, expected);
});

test("build response with body", (t) => {
  const resp1 = new ApiResponse({ customProp: 123 }).build();
  const resp2 = new ApiResponse().data({ customProp: 123 }).build();
  const expected = {
    statusCode: 200,
    body: '{"data":{"customProp":123}}',
    headers: defaultHeaders(),
  };
  t.deepEqual(resp1, expected);
  t.deepEqual(resp2, expected);
});

test("build response with headers", (t) => {
  const resp1 = new ApiResponse(null, null, {
    headers: {
      "x-custom-header": 123,
    },
  }).build();
  const resp2 = new ApiResponse()
    .headers({
      "x-custom-header": 123,
    })
    .build();
  const expected = {
    statusCode: 200,
    body: "{}",
    headers: Object.assign(defaultHeaders(), {
      "x-custom-header": 123,
    }),
  };
  t.deepEqual(resp1, expected);
  t.deepEqual(resp2, expected);
});

test("build response with overriding defaults", (t) => {
  const resp1 = new ApiResponse(null, null, {
    headers: {
      "Cache-Control": "blah",
      "Access-Control-Allow-Origin": "somesite.com",
    },
  }).build();
  const resp2 = new ApiResponse()
    .headers({
      "Cache-Control": "blah",
      "Access-Control-Allow-Origin": "somesite.com",
    })
    .build();
  const expected = {
    statusCode: 200,
    body: "{}",
    headers: {
      "Cache-Control": "blah",
      "Access-Control-Allow-Origin": "somesite.com",
    },
  };
  t.deepEqual(resp1, expected);
  t.deepEqual(resp2, expected);
});

test("build response with statusCode", (t) => {
  const resp1 = new ApiResponse(null, 204, null).build();
  const resp2 = new ApiResponse().statusCode(204).build();
  const expected = {
    statusCode: 204,
    body: "{}",
    headers: defaultHeaders(),
  };
  t.deepEqual(resp1, expected);
  t.deepEqual(resp2, expected);
});

test("build error response", (t) => {
  const boomError = Boom.unauthorized("invalid password", "sample", {
    foo: "bar",
  });

  const oldErrorResponses = new ApiResponse(
    boomError.output.payload,
    boomError.output.statusCode,
    { headers: boomError.output.headers },
  );

  t.deepEqual(oldErrorResponses.build(), {
    statusCode: 401,
    body: JSON.stringify({
      data: {
        statusCode: 401,
        error: "Unauthorized",
        message: "invalid password",
        attributes: { foo: "bar", error: "invalid password" },
      },
    }),
    headers: Object.assign(defaultHeaders(), {
      "WWW-Authenticate": 'sample foo="bar", error="invalid password"',
    }),
  });

  const errorResponse = new ApiResponse()
    .statusCode(boomError.output.statusCode)
    .headers(boomError.output.headers)
    .errors([{ foo: "bar" }]);

  t.deepEqual(errorResponse.build(), {
    statusCode: 401,
    body: JSON.stringify({
      errors: [{ foo: "bar" }],
    }),
    headers: Object.assign(defaultHeaders(), {
      "WWW-Authenticate": 'sample foo="bar", error="invalid password"',
    }),
  });
});
