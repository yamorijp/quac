"use strict";

/**
 * II Authenticated API
 *
 * All requests to Authenticated endpoints must be properly
 * signed as shown in Authentication.
 */

const base = require("./base");


module.exports = Object.assign({},
  require("./order"),
  require("./execution"),
  require("./account"),
  require("./asset"),
  require("./trading"),
  require("./trade")
);
module.exports.set_credential = base.set_credential;
module.exports.get_credential = base.get_credential;
module.exports.clear_credential = base.clear_credential;

