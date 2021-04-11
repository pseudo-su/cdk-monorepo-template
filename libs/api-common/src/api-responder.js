"use strict";

const Boom = require("@hapi/boom");
const { ApiResponse } = require("./api-response");
const { InitError } = require("./init-error");
const { errorsSchema, boomToJsonApi } = require("./jsonapi");

const getErrorsArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.errors)) return data.errors;
  return [];
};

class ApiResponder {
  constructor({ logger, errorReporter, callback } = {}) {
    if (!logger || !errorReporter || !callback) {
      throw new InitError("Responder setup error", {
        logger,
        errorReporter,
        callback,
      });
    }
    this.logger = logger;
    this.errorReporter = errorReporter;
    this.callback = callback;
    // throwApiError
    this.sendValidResponse = this.sendValidResponse.bind(this);
    this.throwApiError = this.throwApiError.bind(this);
    this.sendErrorResponse = this.sendErrorResponse.bind(this);
  }

  throwOnInvalidResponse(apiResponse) {
    const validResponse = apiResponse instanceof ApiResponse;
    if (!validResponse) {
      throw Boom.badImplementation("Must send ApiResponse", apiResponse);
    }
    return apiResponse;
  }

  sendValidResponse(apiResponse) {
    this.logger.debug("Api Response: ", apiResponse);
    this.callback(null, apiResponse.build());
  }

  async throwApiError(caughtError) {
    const boomError = Boom.isBoom(caughtError)
      ? caughtError
      : Boom.badImplementation("Internal Server Error", caughtError);

    if (boomError.isServer) {
      // LOG and REPORT server errors
      this.logger.error("Server Error: ", boomError.stack);
      await this.errorReporter.sendError(boomError);
    }

    throw boomError;
  }

  sendErrorResponse(apiError) {
    const boomError = apiError.isBoom ? apiError : Boom.badImplementation();
    const errorsToValidate = getErrorsArray(boomError.data);

    // If the boom.data is a valid jsonapi response then use it
    // overwise fake it from the Boom error
    const { error: notValid, value: validErrors } = errorsSchema.validate(
      errorsToValidate,
    );

    const errors = notValid ? [boomToJsonApi(boomError)] : validErrors;

    const apiResponse = new ApiResponse()
      .statusCode(boomError.output.statusCode)
      .errors(errors)
      .headers(boomError.output.headers);

    const respBody = apiResponse.build();

    if (apiError.isServer) {
      // TODO: implement proper extraction of error response when serverless
      // supports it without switching away from using lambda-proxy
      // https://github.com/serverless/serverless/issues/3896
      return this.callback(JSON.stringify(respBody));
    }

    this.logger.debug("ErrorResponse(4XX): ", apiError.stack);
    return this.callback(null, respBody);
  }
}

module.exports = {
  ApiResponder,
};
