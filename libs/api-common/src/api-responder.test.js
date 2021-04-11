"use strict";

const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const Boom = require("@hapi/boom");
const { StubSandbox } = require("../test/stubs");
// Sinon sandbox
test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

function apiResponseMock() {
  return class ApiResponseMock {
    constructor() {}
    statusCode() {
      return this;
    }
    errors() {
      return this;
    }
    headers() {
      return this;
    }
    build() {
      return { foo: "bar" };
    }
  };
}

function loadModuleUnderTest(mocked = {}) {
  const injector = proxyquire.noPreserveCache().noCallThru();
  return injector("./api-responder", mocked);
}

test("initialization", (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const mod = loadModuleUnderTest();
  t.notThrows(
    () =>
      new mod.ApiResponder({
        logger: stubs.logger,
        errorReporter: stubs.errorReporter,
        callback: () => {},
      }),
  );
});

test("initialization error", (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const mod = loadModuleUnderTest();
  t.throws(() => new mod.ApiResponder());

  t.throws(
    () =>
      new mod.ApiResponder({
        errorReporter: stubs.errorReporter,
        callback: () => {},
      }),
  );
  t.throws(
    () =>
      new mod.ApiResponder({
        logger: stubs.logger,
        errorReporter: stubs.errorReporter,
      }),
  );
});

test(".throwApiError", async (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const ApiResponseMock = apiResponseMock();
  const mod = loadModuleUnderTest({
    "./api-response": { ApiResponse: ApiResponseMock },
  });

  const responder = new mod.ApiResponder({
    logger: stubs.logger,
    errorReporter: stubs.errorReporter,
    callback: () => {},
  });
  await t.throws(responder.throwApiError(Boom.unauthorized()), "Unauthorized");

  const badResponse = { val: 123 };
  await t.throws(responder.throwApiError(badResponse), "Internal Server Error");
});

test(".sendErrorResponse", async (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const mod = loadModuleUnderTest();
  const callback = sinon.stub();
  const responder = new mod.ApiResponder({
    logger: stubs.logger,
    errorReporter: stubs.errorReporter,
    callback,
  });

  responder.sendErrorResponse({});
  t.snapshot(callback.args[0], "not a valid boom error");

  responder.sendErrorResponse(
    Boom.unauthorized("invalid password", "sample", {
      foo: "bar",
    }),
  );
  t.snapshot(
    callback.args[1],
    "valid boom error without jsonapi errors in data `data`",
  );

  const jsonapiErrors = [
    {
      id: "some-id",
      status: "some-status",
      code: "some-code",
      title: "some-title",
    },
  ];

  responder.sendErrorResponse(
    Boom.unauthorized(
      "invalid password",
      "sample",
      {
        foo: "bar",
      },
      { errors: jsonapiErrors },
    ),
  );
  t.snapshot(
    callback.args[1],
    "valid boom error with jsonapi errors in data `data` 1",
  );

  responder.sendErrorResponse(Boom.badRequest(undefined, jsonapiErrors));
  t.snapshot(
    callback.args[2],
    "valid boom error with jsonapi errors in data `data` 2",
  );

  const invalidErrors = [
    {
      id: "some-id",
      notAllowed: "this key is not allowed",
    },
  ];

  responder.sendErrorResponse(Boom.badRequest(undefined, invalidErrors));
  t.snapshot(
    callback.args[3],
    "valid boom error passed incorrect (not jsonapi) [data]",
  );
});
