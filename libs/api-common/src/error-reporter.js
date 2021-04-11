"use strict";

const { InitError } = require("./init-error");

function useLogging({ logger }) {
  return {
    send(err, sendArgs, callback) {
      logger.error(err);
      callback();
    },
  };
}

class ErrorReporter {
  constructor({ logger = null, config = {} } = {}) {
    const { SERVICE_INSTANCE_NAME = null } = config;
    if (!logger || !SERVICE_INSTANCE_NAME) {
      throw new InitError("ErrorReporter setup error", {
        logger,
        SERVICE_INSTANCE_NAME,
      });
    }
    this.clients = [useLogging({ logger })].filter(Boolean);
    this.sendArgs = {
      service: SERVICE_INSTANCE_NAME,
    };
    this.sendError = this.sendError.bind(this);
  }

  sendError(err) {
    const sendAndResolve = (client) =>
      new Promise((resolve) => {
        client.send(err, this.sendArgs, resolve);
      });
    const sendToClients = this.clients.map(sendAndResolve);
    return Promise.all(sendToClients);
  }
}

module.exports = {
  ErrorReporter,
};
