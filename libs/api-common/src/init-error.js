"use strict";

// Custom ES6 errors in Node.js
// https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216

/**
 * InitError is to be thrown when Classes from `api-common` throw exceptions during initialization
 * EG: `new Logger({})` will throw an init error if you don't pass it a `LOG_LEVEL` parameter.
 */
class InitError extends Error {
  constructor(message, details = {}) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    try {
      this.details = Object.assign({}, details);
      // eslint-disable-next-line unicorn/prefer-optional-catch-binding
    } catch (error) {
      this.details = {};
    }
  }
}

module.exports = {
  InitError,
};
