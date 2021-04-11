"use strict";

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-cache",
};

const defaultOptions = {
  headers: {},
  includeDefaultHeaders: true,
  credentialsOrigin: null,
};

class ApiResponse {
  constructor(data = null, statusCode = null, optionsArg = {}) {
    const options = Object.assign({}, defaultOptions, optionsArg);
    // prettier-ignore
    this._includeDefaultHeaders = options.includeDefaultHeaders;
    this._headers = options.headers;
    this._statusCode = statusCode || 200;
    this._credentialsOrigin = options.credentialsOrigin;
    // JSON API values https://jsonapi.org/format/#document-structure
    this._data = data;
    this._meta = null;
    this._errors = null;
  }

  data(val) {
    this._data = val;
    return this;
  }

  meta(val) {
    this._meta = val;
    return this;
  }

  errors(val) {
    this._errors = val;
    return this;
  }

  statusCode(val) {
    this._statusCode = val;
    return this;
  }

  headers(val) {
    this._headers = val;
    return this;
  }

  includeDefaultHeaders(val = true) {
    this._includeDefaultHeaders = val;
    return this;
  }

  build() {
    return {
      statusCode: this._statusCode,
      headers: buildHeaders(this),
      body: buildBody(this),
    };
  }
}

function buildBody({ _errors, _meta, _data }) {
  const body = {};
  if (_meta) body.meta = _meta;
  if (_data) body.data = _data;
  if (_errors) body.errors = _errors;

  return JSON.stringify(body);
}

function buildHeaders({
  _headers,
  _includeDefaultHeaders,
  _credentialsOrigin,
}) {
  if (_credentialsOrigin) {
    _headers["Access-Control-Allow-Origin"] = _credentialsOrigin;
    _headers["Access-Control-Allow-Credentials"] = "true";
    _headers["Vary"] = "origin";
  }
  const responseHeaders = _includeDefaultHeaders
    ? Object.assign({}, defaultHeaders, _headers)
    : Object.assign({}, _headers);

  return responseHeaders;
}

module.exports = {
  ApiResponse,
};
