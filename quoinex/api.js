/**
 * Quoine API : Generic Client
 */

"use strict";

const qs = require('qs');
const Pusher = require('pusher-js');
const tap = require('liquid-tap');
const jwt = require('jsonwebtoken');
const request = require('then-request');
const requestSync = require('sync-request');

const ENDPOINT = "https://api.quoine.com";
const PUSHER_KEY = "2ff981bb060680b5ce97";
const API_VERSION = 2;

let debug = false;

const set_debug = b => debug = b;

const decode_json = data => data === "" ? "" : JSON.parse(data);

/**
 * HTTP Public API クライアント
 *
 *     new PublicAPI()
 *         .call("GET", "/products/product_cash_btcjpy_5")
 *         .then(console.log)
 *         .catch(console.error)
 */
class PublicAPI {

  makeRequest(method, path, params) {
    params = params && Object.keys(params).length ? params : null;
    method = method.toUpperCase();

    if (method == 'GET' && params) path += '?' + qs.stringify(params);
    let body = (method != 'GET' && params) ? JSON.stringify(params) : "";

    let url = ENDPOINT + path;
    let options = {
      headers: {"Content-Type": "application/json", "X-Quoine-API-Version": API_VERSION},
      body: body,
      timeout: 10000,
      socketTimeout: 10000
    };
    return {method: method, url: url, options: options};
  }

  /**
   * リモートAPI呼び出し
   *
   * @param method {string}
   * @param path {string}
   * @param params {object}
   * @returns {Promise}
   */
  call(method, path, params) {
    let req = this.makeRequest(method, path, params);
    if (debug) {
      return Promise.resolve(req);
    } else {
      return request(req.method, req.url, req.options).getBody('utf-8').then(decode_json);
    }
  }

  /**
   * リモートAPI呼び出し (同期)
   * ブロッキング処理につきサーバーでは使用しないこと
   *
   * @param method {string}
   * @param path {string}
   * @param params {object}
   * @return {object}
   */
  callSync(method, path, params) {
    let req = this.makeRequest(method, path, params);
    if (debug) {
      return req;
    } else {
      let res = requestSync(req.method, req.url, req.options);
      return decode_json(res.getBody('utf-8'));
    }
  }
}

/**
 * HTTP Private API クライアント
 *
 *     new PrivateAPI(API_TOKEN_ID, API_SECRET)
 *         .call("GET", "/v1/me/getchildorders", {product_code: "BTC_JPY"})
 *         .then(console.log)
 *         .catch(console.error)
 */
class PrivateAPI extends PublicAPI {

  constructor(api_token_id, api_secret) {
    super();
    this.setCredential(api_token_id, api_secret);
  }

  /**
   * 認証情報を設定する
   * @param api_token_id
   * @param api_secret
   */
  setCredential(api_token_id, api_secret) {
    this.key = api_token_id;
    this.secret = api_secret;
  }

  sign(path) {
    return jwt.sign({path: path, nonce: Date.now(), token_id: this.key}, this.secret);
  }

  makeRequest(method, path, params) {
    params = params && Object.keys(params).length ? params : null;
    method = method.toUpperCase();

    if (params && method == "GET") path = path + "?" + qs.stringify(params);
    let body = params && method != "GET" ? JSON.stringify(params) : "";

    let url = ENDPOINT + path;
    let options = {
      headers: {
        'Content-Type': 'application/json',
        'X-Quoine-API-Version': API_VERSION,
        'X-Quoine-Auth': this.sign(path)
      },
      body: body,
      timeout: 10000,
      socketTimeout: 10000
    };

    return {method: method, url: url, options: options};
  }
}


/**
 * @deprecated
 * @obsolete
 * WebSocket API: Pusherクライアントラッパー
 *
 * https://pusher.com/docs/client_api_guide
 *
 * new RealtimeAPI()
 *     .subscribe("product_cash_btcjpy_5")
 *     .bind("updated", console.log);
 */
class RealtimeAPI extends Pusher {

  constructor(options) {
    options = Object.assign({cluster: 'mt1'}, options || {});
    super(PUSHER_KEY, options);
  }
}


/**
 * Realtime API (Liquid Tap) クライアントラッパー
 * 
 * new RealtimeAPI()
 *     .subscribe("product_cash_btcjpy_5")
 *     .bind("updated", console.log);
 */
class RealtimeAPI2 {

  constructor(options) {
    this.client = new tap.TapClient(options);
  }

  subscribe(name) {
    return this.client.subscribe(name);
  }
}

module.exports.PublicAPI = PublicAPI;
module.exports.PrivateAPI = PrivateAPI;
module.exports.RealtimeAPI = RealtimeAPI2;
module.exports.set_debug = set_debug;
