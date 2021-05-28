"use strict";

const term = require('./terminal');
const api = require('../quoinex/api');
const product = require('./product');

const base = require('../quoinex/builder/base');
const pub = require('../quoinex/builder/pub');
const pri = require('../quoinex/builder/pri');

const to_float = (s) => {
  let f = parseFloat(s);
  if (isNaN(f)) throw new Error("Error: could not convert string to number");
  return f;
};

const pass = (s) => s;

const upper = (s) => s.toUpperCase();

const price_or_market = (s) => s.toUpperCase() == 'MARKET' ? 'MARKET' : to_float(s);


const order = (side, argv) => {
  let order = new pri.createorder()
    .side(side)
    .product_id(product.get_product(argv[0]).id)
    .quantity(argv[2]);

  if (argv[1] == 'MARKET') {
    if (argv[3] !== null) {
      order.order_type('market_with_range');
      order.price_range(argv[3]);
    } else {
      order.order_type('market');
    }
  } else {
    order.order_type('limit');
    order.price(argv[1]);
  }

  return order;
};

class Command {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._requireArgs = [];
    this._optionalArgs = [];
    this._action = () => {
    };
  }

  getName() {
    return this._name;
  }

  description(text) {
    this._description = text;
    return this;
  }

  getHelp() {
    return this._description;
  }

  getFullHelp() {
    return "\n    " + this._description + "\n" + this.getUsage();
  }

  requireArg(name, help, apply) {
    this._requireArgs.push({name: name, help: help, apply: apply});
    return this;
  }

  optionalArg(name, help, apply, defaultValue) {
    this._optionalArgs.push({name: name, help: help, apply: apply, _: defaultValue});
    return this;
  }

  action(func) {
    this._action = func;
    return this;
  }

  getUsage() {
    let usage = "\n    Usage: ." + this._name + " " +
      this._requireArgs.map(rule => "<" + rule.name + ">").join(" ") + " " +
      this._optionalArgs.map(rule => "[" + rule.name + "]").join(" ") + "\n";

    if (this._requireArgs.length || this._optionalArgs.length) {
      usage += "\n" + this.getUsageArgs() + "\n";
    }
    return usage;
  }

  getUsageArgs() {
    return [].concat(
      this._requireArgs.map(rule => `    <${rule.name}> ${rule.help}`),
      this._optionalArgs.map(rule => `    [${rule.name}] ${rule.help}`)
    ).join("\n");
  }

  parseArg(arg) {
    let argv = typeof arg === 'string' ? arg.trim().split(" ").filter(Boolean) : [];
    if (argv.length < this._requireArgs.length) throw new Error("Error: one or more arguments are required");

    return [].concat(
      this._requireArgs
        .map(rule => rule.apply(argv.shift())),
      this._optionalArgs
        .map(rule => argv.length ? rule.apply(argv.shift()) : rule._),
      argv
    );
  }

  doAction(context, arg) {
    if (arg == "help") {
      console.log(this.getFullHelp());
    } else {
      try {
        let argv = this.parseArg(arg);
        try {
          let data = this._action(argv);
          console.log(data);
        } catch (e) {
          console.error(term.colorful(term.yellow, e.message));
        }
      } catch (e) { // parse error
        console.error(term.colorful(term.yellow, e.message));
        console.log(this.getUsage());
      }
    }
    context.displayPrompt();
  }
}

module.exports.Command = Command;
module.exports.commands = {};

module.exports.commands.cls = new Command("qu_cls")
  .description("表示をクリアします")
  .action(argv => {
    return term.clear;
  });

module.exports.commands.set_key = new Command("qu_set_key")
  .description("API keyとAPI secretを登録します")
  .requireArg("api_key", "API key", pass)
  .requireArg("api_secret", "API secret", pass)
  .action(argv => {
    const pattern = /^[A-Za-z0-9/+]*=*$/;
    if (argv[0].match(pattern) && argv[1].match(pattern)) {
      pri.set_credential(argv[0], argv[1]);
      return "ok";
    } else {
      throw new Error("Error: API key and secret are invalid");
    }
  });

module.exports.commands.store_key = new Command("qu_store_key")
  .description("登録中のAPI keyとAPI secretをファイルに書き出します")
  .action(argv => {
    const c = pri.get_credential();
    if (c.api_key && c.api_secret) {
      require('fs').writeFileSync(
        ".credential.json", JSON.stringify(c), {mode: 384 /*0o600*/});
      return "'.credential.json' created";
    } else {
      throw new Error("Error: API key and API secret are null");
    }
  });


module.exports.commands.markets = new Command("qu_markets")
  .description("マーケットサマリーを表示します")
  .optionalArg("filter", "通貨ペアコードでの絞り込み", upper, "")
  .action(argv => {
    const data = new pub.getproducts().executeSync();
    return data
      .filter(p => p.last_traded_price && parseFloat(p.last_traded_price))
      .filter(p => p.currency_pair_code.indexOf(argv[0]) > -1)
      .map(p => {
        try {
          return {
            code: p.currency_pair_code,
            price: to_float(p.last_traded_price),
            change: to_float(p.last_traded_price) - to_float(p.last_price_24h),
            volume: to_float(p.volume_24h)
          };
        } catch {
          return null;
        }
      })
      .filter(p => !!p);
  });

module.exports.commands.price = new Command("qu_price")
  .description("通貨ペアの取引価格を表示します")
  .requireArg("currency_pair", "通貨ペアコード", upper)
  .action(argv => {
    return new pub.getproduct()
      .id(product.get_product(argv[0]).id)
      .executeSync();
  });

module.exports.commands.balance = new Command("qu_balance")
  .description("資産残高を表示します *")
  .action(argv => {
    const fiats = new pri.getfiataccounts().executeSync();
    const crypto = new pri.getcryptoaccounts().executeSync();
    return fiats.concat(crypto)
      .filter(a => a.balance && parseFloat(a.balance))
      .map(a => {
        return {
          currency: a.currency,
          balance: to_float(a.balance)
        };
      });
  });

module.exports.commands.orders = new Command("qu_orders")
  .description("オープンな注文を最大10件表示します *")
  .optionalArg("currency_pair", "通貨ペアコード", upper, null)
  .action(argv => {
    let orders = new pri.getorders()
      .status("live")
      .limit(10);
    if (argv[0] !== null)
      orders.product_id(product.get_product(argv[0]).id);
    return orders.executeSync().models;
  });

module.exports.commands.histories = new Command("qu_histories")
  .description("約定履歴を最大10件表示します *")
  .requireArg("currency_pair", "通貨ペアコード", upper)
  .action(argv => {
    return new pri.getexecutions()
      .product_id(product.get_product(argv[0]).id)
      .limit(10)
      .executeSync().models;
  });

module.exports.commands.buy = new Command("qu_buy")
  .description("買い注文を発行します *")
  .requireArg("code", "通貨ペア", upper)
  .requireArg("price", "価格 (成行の場合は'MARKET'を指定)", price_or_market)
  .requireArg("quantity", "数量", to_float)
  .optionalArg("slippage", "成行注文の場合はスリッページを指定できます", parseFloat, null)
  .action(argv => {
    return order('buy', argv).executeSync();
  });


module.exports.commands.sell = new Command("qu_sell")
  .description("売り注文を発行します *")
  .requireArg("code", "通貨ペア", upper)
  .requireArg("price", "価格 (成行の場合は'MARKET'を指定)", price_or_market)
  .requireArg("quantity", "数量", to_float)
  .optionalArg("slippage", "成行注文の場合はスリッページを指定できます", parseFloat, null)
  .action(argv => {
    return order('sell', argv).executeSync();
  });

module.exports.commands.cancel = new Command("qu_cancel")
  .description("注文をキャンセルします *")
  .requireArg("order_id", "注文ID", parseInt)
  .action(argv => {
    return new pri.cancelorder()
      .id(argv[0])
      .executeSync();
  });

