"use strict";

/**
 * Executions
 */

const base = require("./base");


/**
 * Get Your Executions
 */
class GetExecutions extends base.PagerMixin(base.Request) {

  constructor() {
    super("GET", "/executions/me", {}, true);
  }

  _validation_schema() {
    return {
      type: "object",
      anyOf: [
        {required: ["currency_pair_code"]},
        {required: ["product_id"]}
      ]
    };
  }

  currency_pair_code(v) {
    this._set("currency_pair_code", base.upper(v), {type: "string"});
    return this;
  }

  product_id(v) {
    this._set("product_id", v, {type: "number"});
    return this;
  }
}


module.exports.getexecutions = GetExecutions;
