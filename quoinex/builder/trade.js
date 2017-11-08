"use strict";

/**
 * Trades
 */

const base = require("./base");


/**
 * Get Trades
 */
class GetTrades extends base.Request {

  constructor() {
    super("GET", "/trades", {}, true);
  }

  funding_currency(v) {
    this._set("funding_currency", base.upper(v), {type: "string"});
    return this;
  }

  status(v) {
    this._set("status", base.lower(v), {"enum": ["open", "closed"]});
    return this;
  }
}

/**
 * Close a trade
 */
class CloseTrade extends base.Request {

  constructor() {
    super("PUT", "/trades/:id/close", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }

  closed_quantity(v) {
    this._set("closed_quantity", v, {type: "number"});
    return this;
  }
}

/**
 * Close all trade
 */
class CloseAllTrade extends base.Request {

  constructor() {
    super("PUT", "/trades/close_all", {}, true);
  }

  side(v) {
    this._set("side", base.lower(v), {"enum": ["short", "long"]});
    return this;
  }
}

/**
 * Update a trade
 */
class UpdateTrade extends base.Request {

  constructor() {
    super("PUT", "/trades/:id", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }

  stop_loss(v) {
    this._set("stop_loss", v, {type: "number"});
    return this;
  }

  take_profit(v) {
    this._set("take_profit", v, {type: "number"});
    return this;
  }
}

/**
 * Get a trade's loans
 */
class GetTradeLoans extends base.Request {

  constructor() {
    super("GET", "/trades/:id/loans", {}, true);
  }


  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }
}


module.exports.gettrades = GetTrades;
module.exports.closetrade = CloseTrade;
module.exports.closealltrade = CloseAllTrade;
module.exports.updatetrade = UpdateTrade;
module.exports.gettradeloans = GetTradeLoans;
