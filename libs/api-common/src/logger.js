// @ts-check
/* eslint-disable no-console */

"use strict";

const { InitError } = require("./init-error");

function noop() {}

// eslint-disable-next-line unicorn/prefer-math-trunc
const ERROR_FLAG = 1 << 0; // 0001
const WARN_FLAG = 1 << 1; //  0010
const INFO_FLAG = 1 << 2; //  0100
const DEBUG_FLAG = 1 << 3; // 1000

const levelFlagMapping = new Map([
  ["error", ERROR_FLAG],
  ["warn", WARN_FLAG],
  ["info", INFO_FLAG],
  ["debug", DEBUG_FLAG],
]);

const defaultLogTransform = (...args) => args;

/**
 * @typedef {('error' | 'warn' | 'info' | 'debug')} LogLevel
 */

class Logger {
  /**
   * Assign the project to an employee.
   * @public
   * @param {object} options - logger options
   * @param {LogLevel} [options.LOG_LEVEL] - The name of the employee.
   * @param {string} [options.LOG_CATEGORY_NAME] - The employee's department.
   * @param {boolean} [options.LOG_JSON] - format log output as JSON
   */
  constructor({ LOG_LEVEL, LOG_CATEGORY_NAME, LOG_JSON = null } = {}) {
    if (!LOG_LEVEL || !LOG_CATEGORY_NAME || LOG_JSON === null) {
      throw new InitError("Logger setup error", {
        LOG_LEVEL,
        LOG_CATEGORY_NAME,
        LOG_JSON,
      });
    }

    const flagSet = levelFlagMapping.get(LOG_LEVEL);
    const flagsWhenError = DEBUG_FLAG | INFO_FLAG | WARN_FLAG | ERROR_FLAG;
    const flagsWhenWarn = DEBUG_FLAG | INFO_FLAG | WARN_FLAG;
    const flagsWhenInfo = DEBUG_FLAG | INFO_FLAG;
    const flagsWhenDebug = DEBUG_FLAG;

    const jsonLogTransform = (...args) => [
      JSON.stringify({
        _sumo_metadata: {
          category: LOG_CATEGORY_NAME,
        },
        message: args,
      }),
    ];

    function emitLog(logMethod, transformer = defaultLogTransform) {
      return (...args) => {
        const logArguments = transformer(...args);
        logMethod(...logArguments);
      };
    }

    const logTransform = LOG_JSON ? jsonLogTransform : defaultLogTransform;

    this.debug =
      flagSet & flagsWhenDebug ? emitLog(console.log, logTransform) : noop;
    this.info =
      flagSet & flagsWhenInfo ? emitLog(console.info, logTransform) : noop;
    this.warn =
      flagSet & flagsWhenWarn ? emitLog(console.warn, logTransform) : noop;
    this.error =
      flagSet & flagsWhenError ? emitLog(console.error, logTransform) : noop;
  }
}

module.exports = {
  Logger,
};
