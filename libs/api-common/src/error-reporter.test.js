"use strict";

const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { StubSandbox } = require("../test/stubs");

// Sinon sandbox
test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

// Dependency injection for module under test
function loadModuleUnderTest(mocked = {}) {
  const injector = proxyquire.noPreserveCache().noCallThru();
  return injector("./error-reporter", mocked);
}

test("initialization", (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const mod = loadModuleUnderTest();
  t.notThrows(
    () =>
      new mod.ErrorReporter({
        logger: stubs.logger,
        config: {
          SERVICE_INSTANCE_NAME: "dummy",
          RAYGUN_API_KEY: "dummy",
        },
      }),
    "ErrorReporter setup error",
  );
});

test("initialization error", (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const mod = loadModuleUnderTest();
  t.throws(() => new mod.ErrorReporter(), "ErrorReporter setup error");
  t.throws(() => new mod.ErrorReporter({ logger: stubs.logger }));
  t.throws(
    () =>
      new mod.ErrorReporter({
        config: {
          SERVICE_INSTANCE_NAME: "dummy",
          RAYGUN_API_KEY: "dummy",
        },
      }),
  );
});

test(".sendError log error when disabled", (t) => {
  const stubs = StubSandbox(t.context.sandbox);
  const mod = loadModuleUnderTest();
  const reporter = new mod.ErrorReporter({
    logger: stubs.logger,
    config: {
      ENABLE_RAYGUN_REPORTING: false,
      SERVICE_INSTANCE_NAME: "instance-name-test",
      RAYGUN_API_KEY: "dummykey",
    },
  });
  reporter.sendError(new Error("Report this!"));

  t.deepEqual(stubs.logger.error.args, [[new Error("Report this!")]]);
});
