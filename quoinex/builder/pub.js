"use strict";

/**
 * I. Public API
 *
 * Public API does not require authentication
 */

const base = require("./base");

/**
 * Get Products
 *
 * Get the list of all available products.
 */
class GetProducts extends base.Request {

  constructor() {
    super("GET", "/products", {}, false);
  }
}


/**
 * Get a Product
 */
class GetProduct extends base.Request {

  constructor() {
    super("GET", "/products/:id", {}, false);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }
}

/**
 * Get Order Book
 *
 * Format - Each price level follows: [price, amount]
 */
class GetOrderBook extends base.Request {

  constructor() {
    super("GET", "/products/:id/price_levels", {}, false);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }

  full(v) {
    this._set("full", v, {type: "number"});
    return this;
  }
}


/**
 * Get Executions | Get Executions by Timestamp
 *
 * Get a list of recent executions from a product
 * (Executions are sorted in DESCENDING order - Latest first)
 *
 * Get a list of executions after a particular time
 * (Executions are sorted in ASCENDING order)
 */
class GetExecutions extends base.PagerMixin(base.Request) {

  constructor() {
    super("GET", "/executions", {}, false);
  }

  _validation_schema() {
    return {
      type: "object",
      anyOf: [
        {required: ["product_id"]},
        {required: ["currency_pair_code"]}
      ]
    };
  }

  product_id(v) {
    this._set("product_id", v, {type: "number"});
    return this;
  }

  currency_pair_code(v) {
    this._set("currency_pair_code", base.upper(v), {type: "string"});
    return this;
  }

  timestamp(v) {
    this._set("timestamp", v, {type: "number"});
    return this;
  }
}


/**
 * Get Interest Rate Ladder for a currency
 *
 * Each level follows: [rate, amount]
 */
class GetInterestRateLadder extends base.Request {

  constructor() {
    super("GET", "/ir_ladders/:currency", {}, false);
  }

  _validation_schema() {
    return { type: "object", required: [":currency"] };
  }

  currency(v) {
    this._set(":currency", base.upper(v), {type: "string"});
    return this;
  }
}


module.exports.getexecutions = module.exports.getexecutionsbytimestamp = GetExecutions;
module.exports.getproducts = GetProducts;
module.exports.getproduct = GetProduct;
module.exports.getorderbook = GetOrderBook;
module.exports.getinterestrateladder = GetInterestRateLadder;
