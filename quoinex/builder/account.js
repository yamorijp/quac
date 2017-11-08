"use strict";

/**
 * Accounts
 */

const base = require("./base");


/**
 * Get Fiat Accounts
 */
class GetFiatAccounts extends base.Request {

  constructor() {
    super("GET", "/fiat_accounts", {}, true);
  }
}

/**
 * Create an Fiat Account
 */
class CreateFiatAccount extends base.Request {

  constructor() {
    super("POST", "/fiat_accounts", {}, true);
  }

  _validation_schema() {
    return { type: "object", required: ["currency"] };
  }

  currency(v) {
    this._set("currency", base.upper(v), {type: "string"});
    return this;
  }
}

/**
 * Get Crypto Accounts
 */
class GetCryptoAccounts extends base.Request {

  constructor() {
    super("GET", "/crypto_accounts", {}, true);
  }
}

/**
 * Get all Account Balances
 */
class GetAccountBalances extends base.Request {

  constructor() {
    super("GET", "/accounts/balance", {}, true);
  }
}

module.exports.getfiataccounts = GetFiatAccounts;
module.exports.createfiataccont = CreateFiatAccount;
module.exports.getcryptoaccounts = GetCryptoAccounts;
module.exports.getaccountbalances = GetAccountBalances;
