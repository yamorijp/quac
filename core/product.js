"use strict";

const api = require('../quoinex/api');

const PAIRS = {
  // id, code, price_fmt, volume_fmt
  "BTCUSD": [1, "CASH", 3, 8],
  "BTCEUR": [3, "CASH", 2, 8],
  "BTCJPY": [5, "CASH", 2, 8],
  "BTCSGD": [7, "CASH", 2, 8],
  "BTCHKD": [9, "CASH", 2, 8],
  "BTCIDR": [11, "CASH", 0, 8],
  "BTCAUD": [13, "CASH", 2, 8],
  "BTCPHP": [15, "CASH", 0, 8],
  "BTCCNY": [17, "CASH", 2, 8],
  "BTCINR": [18, "CASH", 8, 8],
  "ETHUSD": [27, "CASH", 3, 8],
  "ETHEUR": [28, "CASH", 2, 8],
  "ETHJPY": [29, "CASH", 2, 8],
  "ETHSGD": [30, "CASH", 2, 8],
  "ETHHKD": [31, "CASH", 2, 8],
  "ETHIDR": [32, "CASH", 0, 8],
  "ETHAUD": [33, "CASH", 2, 8],
  "ETHPHP": [34, "CASH", 0, 8],
  "ETHCNY": [35, "CASH", 2, 8],
  "ETHINR": [36, "CASH", 8, 8],
  "ETHBTC": [37, "CASH", 8, 8],
  "BCHUSD": [39, "CASH", 3, 8],
  "BCHSGD": [40, "CASH", 2, 8],
  "BCHJPY": [41, "CASH", 2, 8],
  "DASHSGD": [42, "CASH", 2, 8],
  "DASHUSD": [43, "CASH", 3, 8],
  "DASHJPY": [44, "CASH", 2, 8],
  "DASHEUR": [45, "CASH", 2, 8],
  "QTUMSGD": [46, "CASH", 2, 8],
  "QTUMUSD": [47, "CASH", 3, 8],
  "QTUMJPY": [48, "CASH", 2, 8],
  "QTUMEUR": [49, "CASH", 2, 8],
  "QASHJPY": [50, "CASH", 3, 8],
  "QASHETH": [51, "CASH", 8, 8],
  "QASHBTC": [52, "CASH", 8, 8],
  "NEOUSD": [53, "CASH", 3, 8],
  "NEOJPY": [54, "CASH", 2, 8],
  "NEOSGD": [55, "CASH", 2, 8],
  "NEOEUR": [56, "CASH", 2, 8],
  "QASHUSD": [57, "CASH", 3, 8],
  "QASHEUR": [58, "CASH", 2, 8],
  "QASHSGD": [59, "CASH", 2, 8],
  "QASHAUD": [60, "CASH", 2, 8],
  "QASHIDR": [61, "CASH", 0, 8],
  "QASHHKD": [62, "CASH", 2, 8],
  "QASHPHP": [63, "CASH", 0, 8],
  "QASHCNY": [64, "CASH", 2, 8],
  "QASHINR": [65, "CASH", 8, 8],
  "UBTCUSD": [71, "CASH", 3, 8],
  "UBTCJPY": [72, "CASH", 2, 8],
  "UBTCSGD": [73, "CASH", 2, 8],
  "UBTCBTC": [74, "CASH", 8, 8],
  "UBTCETH": [75, "CASH", 8, 8],
  "UBTCQASH": [76, "CASH", 8, 8],
  "XRPJPY": [83, "CASH", 3, 8],
  "XRPUSD": [84, "CASH", 3, 8],
  "XRPEUR": [85, "CASH", 2, 8],
  "XRPSGD": [86, "CASH", 2, 8],
  "XRPIDR": [87, "CASH", 0, 8],
  "XRPQASH": [88, "CASH", 8, 8],
  "RKTSGD": [102, "CASH", 2, 8],
  "RKTAUD": [103, "CASH", 2, 8],
  "RKTUSD": [104, "CASH", 3, 8],
  "RKTEUR": [105, "CASH", 2, 8],
  "RKTJPY": [106, "CASH", 2, 8],
  "ZECBTC": [107, "CASH", 8, 8],
  "REPBTC": [108, "CASH", 8, 8],
  "XMRBTC": [109, "CASH", 8, 8],
  "ETCBTC": [110, "CASH", 8, 8],
  "XRPBTC": [111, "CASH", 8, 8],
  "LTCBTC": [112, "CASH", 8, 8],
  "XEMBTC": [113, "CASH", 8, 8],
  "BCHBTC": [114, "CASH", 8, 8],
  "XLMBTC": [115, "CASH", 8, 8],
  "DASHBTC": [116, "CASH", 8, 8],
  "TRXBTC": [117, "CASH", 8, 8],
  "FCTBTC": [118, "CASH", 8, 8],
  "NEOBTC": [119, "CASH", 8, 8],
  "TRXETH": [120, "CASH", 8, 8],
  "INDBTC": [121, "CASH", 8, 8],
  "INDETH": [122, "CASH", 8, 8],
  "OAXBTC": [127, "CASH", 8, 8],
  "OAXETH": [128, "CASH", 8, 8],
  "STORJBTC": [131, "CASH", 8, 8],
  "STORJETH": [132, "CASH", 8, 8],
  "QTUMBTC": [133, "CASH", 8, 8],
  "QTUMETH": [134, "CASH", 8, 8],
  "NEOETH": [135, "CASH", 8, 8],
  "FCTETH": [136, "CASH", 8, 8],
  "STXETH": [137, "CASH", 8, 8],
  "STXBTC": [138, "CASH", 8, 8],
  "VETBTC": [139, "CASH", 8, 8],
  "VETETH": [140, "CASH", 8, 8],
  "XLMETH": [141, "CASH", 8, 8],
  "MCOETH": [142, "CASH", 8, 8],
  "MCOBTC": [143, "CASH", 8, 8],
  "MCOQASH": [144, "CASH", 8, 8],
  "SPHTXETH": [145, "CASH", 8, 8],
  "SPHTXBTC": [146, "CASH", 8, 8],
  "SPHTXQASH": [147, "CASH", 8, 8],
  "DENTBTC": [148, "CASH", 8, 8],
  "DENTETH": [149, "CASH", 8, 8],
  "DENTQASH": [150, "CASH", 8, 8],
  "VZTBTC": [151, "CASH", 8, 8],
  "VZTETH": [152, "CASH", 8, 8],
  "VZTQASH": [153, "CASH", 8, 8],
  "FDXBTC": [154, "CASH", 8, 8],
  "FDXETH": [155, "CASH", 8, 8],
  "FDXQASH": [156, "CASH", 8, 8],
  "TPTBTC": [157, "CASH", 8, 8],
  "TPTETH": [158, "CASH", 8, 8],
  "TPTQASH": [159, "CASH", 8, 8],
  "ONGBTC": [160, "CASH", 8, 8],
  "ONGETH": [161, "CASH", 8, 8],
  "ONGQASH": [162, "CASH", 8, 8],
  "CANBTC": [163, "CASH", 8, 8],
  "CANETH": [164, "CASH", 8, 8],
  "CANQASH": [165, "CASH", 8, 8],
  "IXTBTC": [166, "CASH", 8, 8],
  "IXTETH": [167, "CASH", 8, 8],
  "IXTQASH": [168, "CASH", 8, 8],
  "MTNETH": [169, "CASH", 8, 8],
  "SALBTC": [170, "CASH", 8, 8],
  "SALETH": [171, "CASH", 8, 8],
  "SALQASH": [172, "CASH", 8, 8],
  "MTNBTC": [173, "CASH", 8, 8],
  "MTNQASH": [174, "CASH", 8, 8],
  "SERBTC": [175, "CASH", 8, 8],
  "SERETH": [176, "CASH", 8, 8],
  "SERQASH": [177, "CASH", 8, 8],
  "ECHBTC": [178, "CASH", 8, 8],
  "ECHETH": [179, "CASH", 8, 8],
  "ECHQASH": [180, "CASH", 8, 8],
  "GATBTC": [181, "CASH", 8, 8],
  "GATETH": [182, "CASH", 8, 8],
  "GATQASH": [183, "CASH", 8, 8],
  "RKTETH": [184, "CASH", 8, 8],
  "BMCBTC": [185, "CASH", 8, 8],
  "BMCETH": [186, "CASH", 8, 8],
  "BMCQASH": [187, "CASH", 8, 8],
  "ETNBTC": [188, "CASH", 8, 8],
  "ETNETH": [189, "CASH", 8, 8],
  "ETNQASH": [190, "CASH", 8, 8],
  "GZEBTC": [191, "CASH", 8, 8],
  "GZEETH": [192, "CASH", 8, 8],
  "GZEQASH": [193, "CASH", 8, 8],
  "SNIPBTC": [194, "CASH", 8, 8],
  "SNIPETH": [195, "CASH", 8, 8],
  "SNIPQASH": [196, "CASH", 8, 8],
  "STUBTC": [197, "CASH", 8, 8],
  "STUETH": [198, "CASH", 8, 8],
  "STUQASH": [199, "CASH", 8, 8],
  "ENJBTC": [200, "CASH", 8, 8],
  "ENJETH": [201, "CASH", 8, 8],
  "ENJQASH": [202, "CASH", 8, 8],
  "RKTBTC": [203, "CASH", 8, 8],
  "RKTQASH": [204, "CASH", 8, 8],
  "STACBTC": [205, "CASH", 8, 8],
  "STACETH": [206, "CASH", 8, 8],
  "STACQASH": [207, "CASH", 8, 8],
  "FLIXXBTC": [208, "CASH", 8, 8],
  "FLIXXETH": [209, "CASH", 8, 8],
  "FLIXXQASH": [210, "CASH", 8, 8],
  "DRGBTC": [211, "CASH", 8, 8],
  "DRGETH": [212, "CASH", 8, 8],
  "DRGQASH": [213, "CASH", 8, 8],
  "1WOBTC": [214, "CASH", 8, 8],
  "1WOETH": [215, "CASH", 8, 8],
  "1WOQASH": [216, "CASH", 8, 8],
  "HEROBTC": [217, "CASH", 8, 8],
  "HEROETH": [218, "CASH", 8, 8],
  "HEROQASH": [219, "CASH", 8, 8],
  "EZTBTC": [220, "CASH", 8, 8],
  "EZTETH": [221, "CASH", 8, 8],
  "EZTQASH": [222, "CASH", 8, 8],
  "LDCBTC": [223, "CASH", 8, 8],
  "LDCETH": [224, "CASH", 8, 8],
  "LDCQASH": [225, "CASH", 8, 8],
  "LALABTC": [226, "CASH", 8, 8],
  "LALAETH": [227, "CASH", 8, 8],
  "LALAQASH": [228, "CASH", 8, 8],
  "AMLTBTC": [229, "CASH", 8, 8],
  "AMLTETH": [230, "CASH", 8, 8],
  "AMLTQASH": [231, "CASH", 8, 8],
  "MGOBTC": [232, "CASH", 8, 8],
  "MGOETH": [233, "CASH", 8, 8],
  "MGOQASH": [234, "CASH", 8, 8],
  "HAVBTC": [235, "CASH", 8, 8],
  "HAVETH": [236, "CASH", 8, 8],
  "HAVQASH": [237, "CASH", 8, 8],
  "UKGBTC": [238, "CASH", 8, 8],
  "UKGETH": [239, "CASH", 8, 8],
  "UKGQASH": [240, "CASH", 8, 8],
  "IPSXBTC": [241, "CASH", 8, 8],
  "IPSXETH": [242, "CASH", 8, 8],
  "IPSXQASH": [243, "CASH", 8, 8],
  "FLUZBTC": [244, "CASH", 8, 8],
  "FLUZETH": [245, "CASH", 8, 8],
  "FLUZQASH": [246, "CASH", 8, 8],
  "TPAYBTC": [247, "CASH", 8, 8],
  "TPAYETH": [248, "CASH", 8, 8],
  "TPAYQASH": [249, "CASH", 8, 8],
  "RBLXBTC": [250, "CASH", 8, 8],
  "RBLXETH": [251, "CASH", 8, 8],
  "RBLXQASH": [252, "CASH", 8, 8],
  "BTRNBTC": [253, "CASH", 8, 8],
  "BTRNETH": [254, "CASH", 8, 8],
  "BTRNQASH": [255, "CASH", 8, 8],
  "ADHBTC": [256, "CASH", 8, 8],
  "ADHETH": [257, "CASH", 8, 8],
  "ADHQASH": [258, "CASH", 8, 8],
  "PALBTC": [259, "CASH", 8, 8],
  "PALETH": [260, "CASH", 8, 8],
  "PALQASH": [261, "CASH", 8, 8],
  "FTXBTC": [262, "CASH", 8, 8],
  "FTXETH": [263, "CASH", 8, 8],
  "FTXQASH": [264, "CASH", 8, 8],
  "WINBTC": [265, "CASH", 8, 8],
  "WINETH": [266, "CASH", 8, 8],
  "WINQASH": [267, "CASH", 8, 8],
  "EARTHBTC": [268, "CASH", 8, 8],
  "EARTHETH": [269, "CASH", 8, 8],
  "EARTHQASH": [270, "CASH", 8, 8],
  "FSNBTC": [271, "CASH", 8, 8],
  "FSNETH": [272, "CASH", 8, 8],
  "FSNQASH": [273, "CASH", 8, 8],
  "THRTBTC": [274, "CASH", 8, 8],
  "THRTETH": [275, "CASH", 8, 8],
  "THRTQASH": [276, "CASH", 8, 8],
  "ZCOBTC": [277, "CASH", 8, 8],
  "ZCOETH": [278, "CASH", 8, 8],
  "ZCOQASH": [279, "CASH", 8, 8],
  "XESBTC": [280, "CASH", 8, 8],
  "XESETH": [281, "CASH", 8, 8],
  "XESQASH": [282, "CASH", 8, 8],
  "MITXBTC": [283, "CASH", 8, 8],
  "MITXETH": [284, "CASH", 8, 8],
  "MITXQASH": [285, "CASH", 8, 8],
  "XNKBTC": [286, "CASH", 8, 8],
  "XNKETH": [287, "CASH", 8, 8],
  "XNKQASH": [288, "CASH", 8, 8],
  "ALXBTC": [289, "CASH", 8, 8],
  "ALXETH": [290, "CASH", 8, 8],
  "ALXQASH": [291, "CASH", 8, 8],
  "SGNBTC": [292, "CASH", 8, 8],
  "SGNETH": [293, "CASH", 8, 8],
  "SGNQASH": [294, "CASH", 8, 8],
  "VUUBTC": [295, "CASH", 8, 8],
  "VUUQASH": [296, "CASH", 8, 8],
  "VUUETH": [297, "CASH", 8, 8],
  "CMCTBTC": [298, "CASH", 8, 8],
  "CMCTETH": [299, "CASH", 8, 8],
  "CMCTQASH": [300, "CASH", 8, 8],
  "IDHBTC": [301, "CASH", 8, 8],
  "IDHETH": [302, "CASH", 8, 8],
  "IDHQASH": [303, "CASH", 8, 8],
  "PLCBTC": [304, "CASH", 8, 8],
  "PLCETH": [305, "CASH", 8, 8],
  "PLCQASH": [306, "CASH", 8, 8],
  "GETBTC": [307, "CASH", 8, 8],
  "GETETH": [308, "CASH", 8, 8],
  "GETQASH": [309, "CASH", 8, 8],
  "LIKEBTC": [310, "CASH", 8, 8],
  "LIKEETH": [311, "CASH", 8, 8],
  "LIKEQASH": [312, "CASH", 8, 8],
  "PWVQASH": [313, "CASH", 8, 8],
  "PWVBTC": [314, "CASH", 8, 8],
  "PWVETH": [315, "CASH", 8, 8],
  "VIOBTC": [316, "CASH", 8, 8],
  "VIOQASH": [317, "CASH", 8, 8],
  "VIOETH": [318, "CASH", 8, 8],
  "CRPTBTC": [321, "CASH", 8, 8],
  "CRPTETH": [322, "CASH", 8, 8],
  "CRPTQASH": [323, "CASH", 8, 8],
  "ELYBTC": [325, "CASH", 8, 8],
  "ELYQASH": [326, "CASH", 8, 8],
  "ELYETH": [327, "CASH", 8, 8],
  "KRLBTC": [346, "CASH", 8, 8],
  "KRLETH": [347, "CASH", 8, 8],
  "KRLQASH": [348, "CASH", 8, 8],
  "SHPBTC": [349, "CASH", 8, 8],
  "SHPETH": [350, "CASH", 8, 8],
  "SHPQASH": [351, "CASH", 8, 8],
  "LNDBTC": [352, "CASH", 8, 8],
  "LNDETH": [353, "CASH", 8, 8],
  "LNDQASH": [354, "CASH", 8, 8],
  "MRKBTC": [358, "CASH", 8, 8],
  "MRKETH": [359, "CASH", 8, 8],
  "MRKQASH": [360, "CASH", 8, 8],
  "BRCBTC": [361, "CASH", 8, 8],
  "BRCETH": [362, "CASH", 8, 8],
  "BRCBCH": [363, "CASH", 8, 8],
  "BRCQASH": [364, "CASH", 8, 8],
  "FLPBTC": [365, "CASH", 8, 8],
  "FLPETH": [366, "CASH", 8, 8],
  "FLPQASH": [367, "CASH", 8, 8],
  "DACSBTC": [380, "CASH", 8, 8],
  "DACSETH": [381, "CASH", 8, 8],
  "DACSQASH": [382, "CASH", 8, 8],
  "ZPRBTC": [383, "CASH", 8, 8],
  "ZPRETH": [384, "CASH", 8, 8],
  "ZPRQASH": [385, "CASH", 8, 8],
  "UBTBTC": [386, "CASH", 8, 8],
  "UBTETH": [387, "CASH", 8, 8],
  "UBTQASH": [388, "CASH", 8, 8],
  "FTTBTC": [389, "CASH", 8, 8],
  "FTTETH": [390, "CASH", 8, 8],
  "FTTQASH": [391, "CASH", 8, 8]
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
    return [product.id, code, 4, 8];
  } else {
    return null;
  }
};

const get_product = (code) => {
  code = code.toUpperCase();
  const pair = find_pair(code);
  if (pair) {
    return new Product(
      "Liquid " + code, pair[0], pair[1], code,
      fixed_formatter(pair[2]),
      fixed_formatter(pair[3])
    );
  }
  throw new InvalidProductCodeError(code);
};

module.exports.get_product = get_product;
module.exports.InvalidProductCodeError = InvalidProductCodeError;
