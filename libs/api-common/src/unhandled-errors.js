"use strict";

const { InitError } = require("./init-error");

module.exports = {
  overrideProcessErrorHandlers,
};

function overrideProcessErrorHandlers({
  errorReporter = null,
  logger = null,
  process = null,
} = {}) {
  if (!errorReporter || !logger || !process) {
    throw new InitError("overrideProcessError setup error", {
      errorReporter,
      logger,
    });
  }

  const reportAndExit = async (err) => {
    logger.error(err.stack);
    if (errorReporter) await errorReporter.sendError(err);

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  };

  /*
   * Add unexpected error handlers
   * DEV: AWS Lambda's `uncaughtException` handler logs `err.stack` and exits forcefully:
   * uncaughtException listeners = [function (err) { console.error(err.stack); process.exit(1); }]
   * We remove it so we can catch async errors and invoke `errorReporter.sendError` before calling `process.exit(1);`
   */
  process.removeAllListeners("uncaughtException");

  process.on("uncaughtException", reportAndExit);
  process.on("unhandledRejection", reportAndExit);
}
