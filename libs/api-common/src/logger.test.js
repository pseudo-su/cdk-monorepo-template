"use strict";

const test = require("ava");
const sinon = require("sinon");
const { Logger } = require("./logger");

// Sinon sandbox
test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

// Using this for stubbing console across tests means we have to use test.serial
function stubConsole(sandbox) {
  const logSpy = sandbox.stub(console, "log");
  const infoSpy = sandbox.stub(console, "info");
  const warnSpy = sandbox.stub(console, "warn");
  const errorSpy = sandbox.stub(console, "error");
  return {
    logSpy,
    infoSpy,
    warnSpy,
    errorSpy,
  };
}

test.serial("logging when LOG_LEVEL is debug", (t) => {
  const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(t.context.sandbox);
  const logger = new Logger({
    LOG_LEVEL: "debug",
    LOG_CATEGORY_NAME: "source/category",
    LOG_JSON: false,
  });

  logger.debug("log debug");
  logger.info("log info");
  logger.warn("log warn");
  logger.error("log error");

  t.deepEqual(logSpy.args, [["log debug"]]);
  t.deepEqual(infoSpy.args, [["log info"]]);
  t.deepEqual(warnSpy.args, [["log warn"]]);
  t.deepEqual(errorSpy.args, [["log error"]]);
});

test.serial(
  "logging when LOG_LEVEL is debug and JSON logging is enabled",
  (t) => {
    const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(
      t.context.sandbox,
    );
    const logger = new Logger({
      LOG_LEVEL: "debug",
      LOG_CATEGORY_NAME: "source/category",
      LOG_JSON: true,
    });

    logger.debug("log debug");
    logger.info("log info");
    logger.warn("log warn");
    logger.error("log error");

    t.deepEqual(logSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log debug"],
        }),
      ],
    ]);
    t.deepEqual(infoSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log info"],
        }),
      ],
    ]);
    t.deepEqual(warnSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log warn"],
        }),
      ],
    ]);
    t.deepEqual(errorSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log error"],
        }),
      ],
    ]);
  },
);

test.serial("logging when LOG_LEVEL is info", (t) => {
  const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(t.context.sandbox);
  const logger = new Logger({
    LOG_LEVEL: "info",
    LOG_CATEGORY_NAME: "source/category",
    LOG_JSON: false,
  });

  logger.debug("log debug");
  logger.info("log info");
  logger.warn("log warn");
  logger.error("log error");

  t.deepEqual(logSpy.args, []);
  t.deepEqual(infoSpy.args, [["log info"]]);
  t.deepEqual(warnSpy.args, [["log warn"]]);
  t.deepEqual(errorSpy.args, [["log error"]]);
});

test.serial(
  "logging when LOG_LEVEL is info and JSON logging is enabled",
  (t) => {
    const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(
      t.context.sandbox,
    );
    const logger = new Logger({
      LOG_LEVEL: "info",
      LOG_CATEGORY_NAME: "source/category",
      LOG_JSON: true,
    });

    logger.debug("log debug");
    logger.info("log info");
    logger.warn("log warn");
    logger.error("log error");

    t.deepEqual(logSpy.args, []);
    t.deepEqual(infoSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log info"],
        }),
      ],
    ]);
    t.deepEqual(warnSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log warn"],
        }),
      ],
    ]);
    t.deepEqual(errorSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log error"],
        }),
      ],
    ]);
  },
);

test.serial("logging when LOG_LEVEL is warn", (t) => {
  const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(t.context.sandbox);
  const logger = new Logger({
    LOG_LEVEL: "warn",
    LOG_CATEGORY_NAME: "source/category",
    LOG_JSON: false,
  });

  logger.debug("log debug");
  logger.info("log info");
  logger.warn("log warn");
  logger.error("log error");

  t.deepEqual(logSpy.args, []);
  t.deepEqual(infoSpy.args, []);
  t.deepEqual(warnSpy.args, [["log warn"]]);
  t.deepEqual(errorSpy.args, [["log error"]]);
});

test.serial(
  "logging when LOG_LEVEL is warn and JSON logging is enabled",
  (t) => {
    const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(
      t.context.sandbox,
    );
    const logger = new Logger({
      LOG_LEVEL: "warn",
      LOG_CATEGORY_NAME: "source/category",
      LOG_JSON: true,
    });

    logger.debug("log debug");
    logger.info("log info");
    logger.warn("log warn");
    logger.error("log error");

    t.deepEqual(logSpy.args, []);
    t.deepEqual(infoSpy.args, []);
    t.deepEqual(warnSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log warn"],
        }),
      ],
    ]);
    t.deepEqual(errorSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log error"],
        }),
      ],
    ]);
  },
);

test.serial("logging when LOG_LEVEL is error", (t) => {
  const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(t.context.sandbox);
  const logger = new Logger({
    LOG_LEVEL: "error",
    LOG_CATEGORY_NAME: "source/category",
    LOG_JSON: false,
  });

  logger.debug("log debug");
  logger.info("log info");
  logger.warn("log warn");
  logger.error("log error");

  t.deepEqual(logSpy.args, []);
  t.deepEqual(infoSpy.args, []);
  t.deepEqual(warnSpy.args, []);
  t.deepEqual(errorSpy.args, [["log error"]]);
});

test.serial(
  "logging when LOG_LEVEL is error and JSON logging is enabled",
  (t) => {
    const { logSpy, infoSpy, warnSpy, errorSpy } = stubConsole(
      t.context.sandbox,
    );
    const logger = new Logger({
      LOG_LEVEL: "error",
      LOG_CATEGORY_NAME: "source/category",
      LOG_JSON: true,
    });

    logger.debug("log debug");
    logger.info("log info");
    logger.warn("log warn");
    logger.error("log error");

    t.deepEqual(logSpy.args, []);
    t.deepEqual(infoSpy.args, []);
    t.deepEqual(warnSpy.args, []);
    t.deepEqual(errorSpy.args, [
      [
        JSON.stringify({
          _sumo_metadata: { category: "source/category" },
          message: ["log error"],
        }),
      ],
    ]);
  },
);
