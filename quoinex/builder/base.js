"use strict";

const jschema = require('jsonschema');
const api = require('../api');


let apiPrivate = new api.PrivateAPI(null, null);
let apiPublic = new api.PublicAPI();
let _credential = null;

/**
 * Builderで使用するAPI keyとAPI secretを登録
 */
const set_credential = (api_key, api_secret) => {
  _credential = {api_key: api_key, api_secret: api_secret};
};

/**
 * Builderで使用中のAPI KeyとAPI secretを取得
 */
const get_credential = () => _credential;

/**
 * API keyとAPI secretを削除
 */
const clear_credential = () => {
  set_credential(null, null);
};

/**
 * null以外は強制的に大文字文字列化
 */
const upper = (v) => v === null ? v : (v + "").toUpperCase();
const lower = (v) => v === null ? v : (v + "").toLowerCase();

const bool = (v) => v === null ? v : !!v;


/**
 * BuilderAPIベースクラス
 */
class Request {

  constructor(method, path, defaultParams, isPrivate) {
    this._method = method;
    this._path = path;
    this._params = defaultParams;
    this._is_private = isPrivate;
  }

  toString() {
    return `${this._method} ${this._path}\t${JSON.stringify(this._params)}`;
  }

  static create() {
    return new this();
  }

  execute(sync) {
    this._validate();

    let path = this._path;
    let params = {};
    Object.keys(this._params).forEach(k => {
      if (k.startsWith(":")) {
        path = path.replace(k, this._params[k]);
      } else {
        params[k] = this._params[k];
      }
    });

    let client;
    if (this._is_private) {
      let credential = get_credential();
      if (!credential) {
        throw new Error("Private API requires Credential. Please call 'auth.set_credential(API_KEY, API_SECRET)'.");
      }
      client = apiPrivate;
      client.setCredential(credential.api_key, credential.api_secret);
    } else {
      client = apiPublic;
    }

    if (sync) {
      return client.callSync(this._method, path, params);
    } else {
      return client.call(this._method, path, params);
    }
  }

  executeSync() {
    return this.execute(true);
  }

  _validate() {
    let result = jschema.validate(this._params, this._validation_schema());
    if (result.errors.length > 0) throw result;
  }

  _validation_schema() {
    return {};
  }

  _set(name, v, schema) {
    // null means delete
    if (v === null) {
      delete this._params[name];
      return;
    }
    let result = jschema.validate(v, schema, {propertyName: name});
    if (result.errors.length > 0) throw result;

    this._params[name] = result.instance;
  }

  setParams(data) {
    Object.entries(data).forEach(item => {
      if (typeof(this[item[0]]) === 'function') {
        this[item[0]](item[1]);
      }
    });
    return this;
  }
}


/**
 * Mixin: ページング用プロパティを追加
 */
let PagerMixin = (superclass) => class extends superclass {

  limit(v) {
    this._set("limit", v, {type: "number"});
    return this;
  }

  page(v) {
    this._set("page", v, {type: "number"});
    return this;
  }
};


module.exports.get_credential = get_credential;
module.exports.set_credential = set_credential;
module.exports.clear_credential = clear_credential;
module.exports.upper = upper;
module.exports.lower = lower;
module.exports.bool = bool;

module.exports.Request = Request;
module.exports.PagerMixin = PagerMixin;
