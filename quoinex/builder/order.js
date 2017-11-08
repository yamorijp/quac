"use strict";

/**
 * Orders
 */

const base = require("./base");


/**
 * Create an Order
 */
class CreateOrder extends base.Request {

  constructor() {
    super("POST", "/orders", {}, true);
  }

  _validation_schema() {
    let schema = {
      type: "object",
      required: ["order_type", "product_id", "side", "quantity"],
    };
    if (this._params.order_type == "limit") {
      schema.required.push("price");
    }
    if (this._params.order_type == "market_with_range") {
      schema.required.push("price");
      schema.required.push("price_range");
    }
    return schema
  }

  order_type(v) {
    this._set("order_type", base.lower(v), {"enum": ["limit", "market", "market_with_range"]});
    return this;
  }

  product_id(v) {
    this._set("product_id", v, {type: "number"});
    return this;
  }

  side(v) {
    this._set("side", v, {"enum": ["buy", "sell"]});
    return this;
  }

  quantity(v) {
    this._set("quantity", v, {type: "number"});
    return this;
  }

  price(v) {
    this._set("price", v, {type: "number"});
    return this;
  }

  price_range(v) {
    this._set("price_range", v, {type: "number"});
    return this;
  }

  leverage_level(v) {
    this._set("leverage_level", v, {type: "number"});
    return this;
  }

  funding_currency(v) {
    this._set("funding_currency", base.upper(v), {type: "string"});
    return this;
  }

  order_direction(v) {
    this._set("order_direction", base.lower(v), {"enum": ["one_direction", "two_direction", "netout"]});
    return this;
  }
}


/**
 * Get an Order
 */
class GetOrder extends base.Request {

  constructor() {
    super("GET", "/orders/:id", {}, true);
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
 * Get Orders
 */
class GetOrders extends base.PagerMixin(base.Request) {

  constructor() {
    super("GET", "/orders", {}, true);
  }

  currency_pair_code(v) {
    this._set("currency_pair_code", base.upper(v), {type: "string"});
    return this;
  }

  funding_currency(v) {
    this._set("funding_currency", base.upper(v), {type: "string"});
    return this;
  }

  product_id(v) {
    this._set("product_id", v, {type: "number"});
    return this;
  }

  // live, filled, cancelled
  status(v) {
    this._set("status", base.lower(v), {type: "string"});
    return this;
  }

  with_details(v) {
    this._set("with_details", v, {type: "number"});
    return this;
  }
}


/**
 * Cancel an Order
 */
class CancelOrder extends base.Request {

  constructor() {
    super("PUT", "/orders/:id/cancel", {}, true);
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
 * Edit a Live Order
 */
class EditOrder extends base.Request {

  constructor() {
    super("PUT", "/orders/:id", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }

  quantity(v) {
    this._set("quantity", v, {type: "number"});
    return this;
  }

  price(v) {
    this._set("price", v, {type: "number"});
    return this;
  }
}


/**
 * Get an Order's Trades
 */
class GetOrderTrades extends base.Request {

  constructor() {
    super("GET", "/orders/:id/trades", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }
}


module.exports.createorder = CreateOrder;
module.exports.getorder = GetOrder;
module.exports.getorders = GetOrders;
module.exports.cancelorder = CancelOrder;
module.exports.editorder = EditOrder;
module.exports.getordertrades = GetOrderTrades;
