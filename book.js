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

let product = {};
let health = new model.Health();
let ticker = new model.Ticker();
let book = new model.OrderBook();


const _render = () => {
  let out = process.stdout;

  out.write(term.clear);
  out.write(term.nl);

  out.write("  Product:".padEnd(20));
  out.write(product.name.padStart(26));
  out.write(term.nl);

  out.write("  Last Price:".padEnd(20));
  out.write(term.colorful(
    term.updown_color(ticker.price, ticker.price_old),
    product.format_price(ticker.price).padStart(26)));
  out.write(term.nl);

  out.write("  Bid/Ask Ratio:".padEnd(20));
  const ratio = book.getBuySellRatio();
  out.write(term.colorful(
    term.updown_color(ratio, 1.0),
    ratio.toFixed(2).padStart(26)));
  out.write(term.nl);

  out.write("  24H Volume:".padEnd(20));
  out.write(product.format_volume(ticker.volume).padStart(26));
  out.write(term.nl);

  out.write(term.separator + term.nl);

  book.getAsks().forEach(row => {
    out.write(product.format_volume(row[1]).padStart(16));
    out.write(" " + term.colorful(
        term.ask_color, product.format_price(row[0]).padStart(12)) + " ");
    out.write("".padEnd(16));
    out.write(term.nl);
  });
  book.getBids().forEach(row => {
    out.write("".padEnd(16));
    out.write(" " + term.colorful(
        term.bid_color, product.format_price(row[0]).padStart(12)) + " ");
    out.write(product.format_volume(row[1]).padStart(16));
    out.write(term.nl);
  });

  out.write(term.separator + term.nl);

  out.write(`  Service) ${health.health}`);
  out.write(term.nl);
};
const render = throttle(_render, render_wait);


const subscribe = () => {
  const socket = new api.RealtimeAPI();
  socket.subscribe(product.get_ticker_channel()).bind("updated", data => {
    ticker.update(data);
    render();
  });
  socket.subscribe(product.get_ladders_buy_channel()).bind("updated", data => {
    book.updateBids(data);
    render();
  });
  socket.subscribe(product.get_ladders_sell_channel()).bind("updated", data => {
    book.updateAsks(data);
    render();
  });
};


const main = (program) => {

  const check_health = () => {
    pub.call("GET", "/products/" + product.id)
      .then(() => health.setHealth(1))
      .catch(() => health.setHealth(0))
      .then(() => render());
  };

  product = products.get_product(program.product);
  book.setRowCount(program.row).setGroupingFactor(program.group);

  Promise.all([
    pub.call("GET", "/products/" + product.id),
    pub.call("GET", "/products/" + product.id + "/price_levels", {full: 1})])
    .then(responses => {
      ticker.update(responses[0]);
      book.setBids(responses[1].buy_price_levels);
      book.setAsks(responses[1].sell_price_levels);
      render();
      subscribe();
    });

  check_health();
  setInterval(check_health, 60000);
};

process.on("uncaughtException", (err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});

const program = require('commander');
program
  .version(require("./package.json").version)
  .description("Display QUOINEX's order book")
  .option("-p, --product <code>", "Currency pair code (default: BTCJPY)", s => s.toUpperCase(), "BTCJPY")
  .option("-r, --row <n>", "Number of display rows (default: 20)", v => parseInt(v), 20)
  .option("-g, --group <n>", "Order grouping unit (default: 0.0)", v => parseFloat(v), 0.0)
  .on("--help", () => {
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ node book.js -p BTCJPY -r 32 -g 1000");
    console.log("");
  })
  .parse(process.argv);

main(program);

