"use strict";
const Joi = require("joi");

// prettier-ignore
const errorsSchema = Joi.array().min(1).items(
  Joi.object().keys({
    id: Joi.string(),
    links: Joi.object({
      about: Joi.string(),
    }),
    status: Joi.string(),
    code: Joi.string(),
    title: Joi.string(),
    detail: Joi.string(),
    source: Joi.object({
      pointer: Joi.string(),
      parameter: Joi.string(),
    }),
    meta: Joi.object().unknown(),
  })
);

function boomToJsonApi(boomErr) {
  const { statusCode, error, message, detail, meta } = boomErr.output.payload;
  // convert http status message into uppercase+underscores code eg: BAD_REQUEST
  const code = error.toUpperCase().replace(/ /g, "_");

  const structure = {
    status: statusCode.toString(),
    code,
    title: message,
  };

  if (detail) {
    structure.detail = detail;
  }

  if (meta) {
    structure.meta = meta;
  }

  return structure;
}

module.exports = {
  errorsSchema,
  boomToJsonApi,
};
