"use strict";

/**
 * Get Trading Accounts
 */

const base = require("./base");


/**
 * Get Trading Accounts
 */
class GetTradingAccounts extends base.Request {

  constructor() {
    super("GET", "/trading_accounts", {}, true);
  }
}


/**
 * Get a Trading Account
 */
class GetTradingAccount extends base.Request {

  constructor() {
    super("GET", "/trading_accounts/:id", {}, true);
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
 * Update Leverage Level
 */
class UpdateLeverageLevel extends base.Request {

  constructor() {
    super("PUT", "/trading_accounts/:id", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: [":id", "leverage_level"] };
  }

  id(v) {
    this._set(":id", v, {type: "number"});
    return this;
  }

  leverage_level(v) {
    this._set("leverage_level", v, {type: "number"});
    return this;
  }
}

module.exports.gettradingaccounts = GetTradingAccounts;
module.exports.gettradingaccount = GetTradingAccount;
module.exports.updateleveragelevel = UpdateLeverageLevel;
