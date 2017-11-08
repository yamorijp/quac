"use strict";

const api = require('../quoinex/api');

const PAIRS = {
  // 2017.11.07
  // id, code, price_fmt, volume_fmt
  BTCUSD:  [1,  "CASH", 2, 8],
  BTCEUR:  [3,  "CASH", 2, 8],
  BTCJPY:  [5,  "CASH", 0, 8],
  BTCSGD:  [7,  "CASH", 2, 8],
  BTCHKD:  [9,  "CASH", 2, 8],
  BTCIDR:  [11, "CASH", 0, 8],
  BTCAUD:  [13, "CASH", 2, 8],
  BTCPHP:  [15, "CASH", 0, 8],
  BTCCNY:  [17, "CASH", 2, 8],
  BTCINR:  [18, "CASH", 0, 8],
  ETHUSD:  [27, "CASH", 2, 8],
  ETHEUR:  [28, "CASH", 2, 8],
  ETHJPY:  [29, "CASH", 0, 8],
  ETHSGD:  [30, "CASH", 2, 8],
  ETHHKD:  [31, "CASH", 2, 8],
  ETHIDR:  [32, "CASH", 0, 8],
  ETHAUD:  [33, "CASH", 2, 8],
  ETHPHP:  [34, "CASH", 0, 8],
  ETHCNY:  [35, "CASH", 2, 8],
  ETHINR:  [36, "CASH", 0, 8],
  ETHBTC:  [37, "CASH", 5, 8],
  BCHUSD:  [39, "CASH", 2, 8],
  BCHSGD:  [40, "CASH", 2, 8],
  BCHJPY:  [41, "CASH", 0, 8],
  DASHSGD: [42, "CASH", 2, 8],
  DASHUSD: [43, "CASH", 2, 8],
  DASHJPY: [44, "CASH", 0, 8],
  DASHEUR: [45, "CASH", 2, 8],
  QTUMSGD: [46, "CASH", 2, 8],
  QTUMUSD: [47, "CASH", 2, 8],
  QTUMJPY: [48, "CASH", 0, 8],
  QTUMEUR: [49, "CASH", 2, 8],
  QASHJPY: [50, "CASH", 5, 8],
  QASHETH: [51, "CASH", 5, 8],
  QASHBTC: [52, "CASH", 8, 8]
};

class Product {

  constructor(name, id, code, pair, price_fmt, volume_fmt, change_p_fmt) {
    this.name = name;
    this.id = id;
    this.code = code.toLowerCase();
    this.pair = pair.toLowerCase();
    this.price_formatter = price_fmt || fixed_formatter(0);
    this.volume_formatter = volume_fmt || fixed_formatter(8);
    this.percent_formatter = change_p_fmt || percent_formatter(2);
  }

  format_price(n) {
    return this.price_formatter(n);
  }

  format_volume(n) {
    return this.volume_formatter(n);
  }

  format_change_p(n) {
    return this.percent_formatter(n);
  }

  get_ticker_channel() {
    return `product_${this.code}_${this.pair}_${this.id}`;
  }

  get_executions_channel() {
    return `executions_${this.code}_${this.pair}`;
  }

  get_ladders_buy_channel() {
    return `price_ladders_${this.code}_${this.pair}_buy`;
  }

  get_ladders_sell_channel() {
    return `price_ladders_${this.code}_${this.pair}_sell`;
  }
}

class InvalidProductCodeError {

  constructor(product_code) {
    this.name = 'InvalidProductCodeError';
    this.product_code = product_code;
    this.message = `"${product_code}" isn't supported.`;
  }
}


const fixed_formatter = (digit) => {
  return (n) => n.toFixed(digit);
};

const percent_formatter = (digit) => {
  return (n) => `${n >= 0.0 ? "+" : ""}${(n*100.0).toFixed(digit)}%`;
};

const find_pair = (code) => {
  if (code in PAIRS) return PAIRS[code];

  const product = new api.PublicAPI()
    .callSync("GET", "/products")
    .find(row => row.currency_pair_code == code);
  if (product) {
    return [product.id, code, 2, 8];
  } else {
    return null;
  }
};

const get_product = (code) => {
  code = code.toUpperCase();
  const pair = find_pair(code);
  if (pair) {
    return new Product(
      "Quoine " + code, pair[0], pair[1], code,
      fixed_formatter(pair[2]),
      fixed_formatter(pair[3])
    );
  }
  throw new InvalidProductCodeError(code);
};

module.exports.get_product = get_product;
module.exports.InvalidProductCodeError = InvalidProductCodeError;
