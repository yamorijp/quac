#!/usr/bin/env node

"use strict";

require('./core/polyfill');

const throttle = require('lodash.throttle');
const api = require('./quoinex/api');
const pub = new api.PublicAPI();

const term = require('./core/terminal');
const model = require('./core/model');
const products = require('./core/product');

const render_wait = 200;

let product_map = new Map();
let tickers = null;


const _render = () => {
  let out = process.stdout;

  out.cork();

  out.write(term.clear);
  out.write(term.nl);

  out.write("  Exchange:".padEnd(20));
  out.write("Liquid Exchange".padStart(26));
  out.write(term.nl);

  out.write("  Last Update:".padEnd(20));
  out.write(new Date().toLocaleTimeString().padStart(26));
  out.write(term.nl);

  out.write(term.nl);

  out.write("  " + "Code".padEnd(8));
  out.write(" " + "Price".padStart(10));
  out.write(" " + "24H".padStart(8));
  out.write(" " + "Volume".padStart(15));
  out.write(term.nl);

  out.write(term.separator + term.nl);

  product_map.forEach((p, id) => {
    const data = tickers.get(id);
    out.write("  " + p.pair.toUpperCase().padEnd(8));
    out.write(" " + term.colorful(
        term.updown_color(data.price, data.price_old),
        p.format_price(data.price).padStart(10)));
    out.write(" " + term.colorful(
        term.updown_color(data.change, 0.0),
        p.format_change_p(data.change).padStart(8)));
    out.write(" " + p.format_volume(data.volume).padStart(15));
    out.write(term.nl);
  });

  out.write(term.separator + term.nl);
  out.write(term.nl);

  process.nextTick(() => out.uncork());
};
const render = throttle(_render, render_wait);


const main = (program) => {
  program.product
    .split(",").filter(s => s.trim())
    .forEach(s => {
      const p = products.get_product(s);
      product_map.set(p.id, p);
    });

  tickers = new model.TickerBoard(product_map);
  pub.call("GET", "/products")
    .then(models => {
      models.forEach(m => tickers.update(m.id, m));
      render();
    })
    .then(() => {
      const socket = new api.RealtimeAPI();
      const callback = data => {
        const data_ = JSON.parse(data);
        tickers.update(data_.id, data_);
        render();
      }
      product_map.forEach(v => socket.subscribe(v.get_ticker_channel()).bind('updated', callback));
    });
};

process.on("uncaughtException", (err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});

const program = require('commander');
program
  .version(require("./package.json").version)
  .description("Display LIQUID's ticker")
  .option("-p, --product <code>",
    "Currency pair codes, comma separated (default: BTCJPY,ETHJPY,BCHJPY,ETHBTC,BTCUSD)",
    s => s.toUpperCase(),
    "BTCJPY,ETHJPY,BCHJPY,ETHBTC,BTCUSD")
  .on("--help", () => {
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ node ticker.js -p BTCUSD,ETHBTC");
    console.log("");
  })
  .parse(process.argv);

main(program);

