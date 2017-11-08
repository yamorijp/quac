"use strict";

/**
 * Assets Lending
 */

const base = require("./base");

/**
 * Create a loan bid
 */
class CreateLoadBid extends base.Request {

  constructor() {
    super("POST", "/loan_bids", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: ["rate", "quantity", "currency"] };
  }

  rate(v) {
    this._set("rate", v, {type: "number"});
    return this;
  }

  quantity(v) {
    this._set("quantity", v, {type: "number"});
    return this;
  }

  currency(v) {
    this._set("currency", base.upper(v), {type: "string"});
    return this;
  }
}

/**
 * Get loan bids
 */
class GetLoanBid extends base.Request {

  constructor() {
    super("GET", "/loan_bids", {}, true);
  }

  currency(v) {
    this._set("currency", base.upper(v), {type: "string"});
    return this;
  }
}

/**
 * Close loan bid
 */
class CloseLoadBid extends base.Request {

  constructor() {
    super("PUT", "/loan_bids/:id/close", {}, true);
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
 * Get Loans
 */
class GetLoans extends base.Request {

  constructor() {
    super("GET", "/loans", {}, true);
  }

  currency(v) {
    this._set("currency", base.upper(v), {type: "string"});
    return this;
  }
}

/**
 * Update a Loan
 */
class UpdateLoan extends base.Request {

  constructor() {
    super("PUT", "/loans/:id", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: [":id"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }

  fund_reloaned(v) {
    this._set("fund_reloaned", v, {type: "boolean"});
    return this;
  }

}

module.exports.createloanbid = CreateLoadBid;
module.exports.getloanbid = GetLoanBid;
module.exports.closeloanbid = CloseLoadBid;
module.exports.getloans = GetLoans;
module.exports.updateloan = UpdateLoan;
