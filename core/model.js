"use strict";

class OrderBook {

  constructor() {
    this.bids = new Map();
    this.bid_volume = 0.0;
    this.asks = new Map();
    this.ask_volume = 0.0;
    this.factor = 0.0;
    this.size = 24;
  }

  setGroupingFactor(n) {
    this.factor = n;
    return this;
  }

  setRowCount(n) {
    this.size = n;
    return this;
  }

  setBids(data) {
    this.bids.clear();
    this._mergeBids(data);
    return this;
  }

  updateBids(data) {
    if (!data || !data.length) return this.setBids([]);

    const min = parseFloat(data[data.length - 1][0]);
    Array.from(this.bids.keys())
      .filter(key => key >= min)
      .forEach(key => this.bids.delete(key));

    this._mergeBids(data);
    return this;
  }

  _mergeBids(data=[]) {
    data.forEach(row => this.bids.set(parseFloat(row[0]), parseFloat(row[1])));
    this.bid_volume = Array.from(this.bids.values()).reduce((x, y) => x + y);
  }

  setAsks(data) {
    this.asks.clear();
    this._mergeAsks(data);
    return this;
  }

  updateAsks(data) {
    if (!data || !data.length) return this.setAsks([]);

    const max = parseFloat(data[data.length - 1][0]);
    Array.from(this.asks.keys())
      .filter(key => key <= max )
      .forEach(key => this.asks.delete(key));

    this._mergeAsks(data);
    return this;
  }

  _mergeAsks(data) {
    data.forEach(row => this.asks.set(parseFloat(row[0]), parseFloat(row[1])));
    this.ask_volume = Array.from(this.asks.values()).reduce((x, y) => x + y);
  }

  _grouping(data, factor, func) {
    let groups = new Map();
    data.forEach((size, price) => {
      let group = func(price / factor) * factor;
      groups.set(group, (groups.get(group) || 0.0) + size);
    });
    return groups;
  }

  getBids() {
    let rows = this.factor == 0.0 ? this.bids : this._grouping(this.bids, this.factor, Math.floor);
    return Array.from(rows.keys())
      .sort((a, b) => b - a)
      .slice(0, this.size)
      .map(price => [price, rows.get(price)])
  }

  getAsks() {
    let rows = this.factor == 0.0 ? this.asks : this._grouping(this.asks, this.factor, Math.ceil);
    return Array.from(rows.keys())
      .sort((a, b) => b - a)
      .slice(-this.size)
      .map(price => [price, rows.get(price)])
  }

  getBuySellRatio() {
    return this.bid_volume / this.ask_volume;
  }
}


class ExecutionBuffer {

  constructor() {
    this.capacity = 48;
    this.data = [];
    this.locking = false;
    this.pendings = [];
    this.tip = 0;
  }

  setCapacity(n) {
    this.capacity = n;
    return this;
  }

  lock() {
    this.locking = true;
    return this;
  }

  unlock() {
    this.locking = false;
    this.pendings.forEach(data => this.add(data));
    this.pendings = [];
    return this;
  }

  size() {
    return this.data.length;
  }

  _toEntity(row) {
    return {
      id: row.id,
      time: new Date(row.created_at * 1000),
      side: row.taker_side.toUpperCase(),
      price: parseFloat(row.price),
      size: parseFloat(row.quantity),
      total: parseFloat(row.price) * parseFloat(row.quantity)
    };
  }

  getStats() {
    let buy_volume = this.data
      .filter(row => row.side == 'BUY')
      .reduce((prev, curr) => prev + curr.size, 0.0);
    let sell_volume = this.data
      .filter(row => row.side == 'SELL')
      .reduce((prev, curr) => prev + curr.size, 0.0);
    let ratio = sell_volume === 0.0 ? 1.0 : buy_volume / sell_volume;
    return {
      buy_volume: buy_volume,
      sell_volume: sell_volume,
      change: ratio
    };
  }

  set(obj) {
    // order: asc
    this.data = obj
      .slice(-this.capacity)
      .map(row => this._toEntity(row));
    this.tip = this.data[this.data.length - 1].id;
    return this;
  }

  add(obj) {
    if (this.locking) {
      this.pendings.push(obj);
    } else if (obj.id > this.tip) {
      let entity = this._toEntity(obj);
      this.data.push(entity);
      this.tip = entity.id;
      if (this.data.length > this.capacity) {
        this.data = this.data.slice(-this.capacity);
      }
    }
    return this;
  }
}


class Ticker {

  constructor() {
    this.price_old = 0.0;
    this.price = 0.0;
    this.change = 0.0;
    this.volume = 0.0;
  }

  update(data) {
    let old = this.price;
    this.price = parseFloat(data.last_traded_price);
    this.volume = parseFloat(data.volume_24h);
    this.change = (1.0 - (this.price / parseFloat(data.last_price_24h))) * -1;
    this.price_old = old || this.price;
    return this;
  }
}


class TickerBoard {

  constructor(products) {
    this.data = new Map();
    products.forEach((v, k) => this.data.set(k, new Ticker()));
  }

  update(id, data) {
    if (this.data.has(id))
      this.data.get(id).update(data);
  }

  get(id) {
    return this.data.get(id);
  }
}


class Health {

  constructor() {
    this.health = "";
  }

  setHealth(b) {
    this.health = b ? "ONLINE" : "OFFLINE";
  }
}


module.exports.OrderBook = OrderBook;
module.exports.ExecutionBuffer = ExecutionBuffer;
module.exports.Ticker = Ticker;
module.exports.TickerBoard = TickerBoard;
module.exports.Health = Health;
