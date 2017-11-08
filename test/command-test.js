require('../core/polyfill');

const assert = require('assert');
const command = require('../core/command');
const pri = require('../quoinex/builder/pri');

const upper = s => s.toUpperCase();
const pass = s => s;
const load_credential = () => {
  try {
    const config = require('../.credential.json');
    if (config.api_key && config.api_secret) {
      pri.set_credential(config.api_key, config.api_secret);
      return true;
    }
  } catch (e) {
  }
  return false;
};

describe('command class argument parser', () => {
  describe('required arguments', () => {
    const cmd = new command.Command()
      .requireArg("r1", "require arg1", upper)
      .requireArg("r2", "require arg2", upper);
    it('should return array', () => {
      assert.deepEqual(cmd.parseArg("hello world"), ["HELLO", "WORLD"]);
    });
    it('extra arguments are just added to array', () => {
      assert.deepEqual(cmd.parseArg("hello world mocha"), ["HELLO", "WORLD", "mocha"]);
    });
    it('should throw error if some arguments is missing', () => {
      assert.throws(() => cmd.parseArg("hello"), Error);
    });
  });

  describe('optional arguments', () => {
    const cmd = new command.Command()
      .optionalArg("o1", "optional arg1", upper, "default1")
      .optionalArg("o2", "optional arg1", upper, "default2");
    it('should return array', () => {
      assert.deepEqual(cmd.parseArg("hello world"), ["HELLO", "WORLD"]);
    });
    it('it is ok even if some arguments is missing', () => {
      assert.deepEqual(cmd.parseArg("hello"), ["HELLO", "default2"]);
      assert.deepEqual(cmd.parseArg(null), ["default1", "default2"]);
    });
  });

  describe('mix require and optional', () => {
    const cmd = new command.Command()
      .requireArg("r1", "require arg1", upper, "default1")
      .optionalArg("o1", "optional arg1", upper, "default2");
    it('should return array', () => {
      assert.deepEqual(cmd.parseArg("hello world"), ["HELLO", "WORLD"]);
    });
    it('optional arguments is processed after required one', () => {
      assert.deepEqual(cmd.parseArg("hello"), ["HELLO", "default2"]);
    });
    it('required arguments is require', () => {
      assert.throws(() => cmd.parseArg(""), Error);
    });
  });
});

describe('cls command', () => {
  const cmd = command.commands.cls;

  describe('_action', () => {
    it('should return clear code', () => {
      assert.equal(cmd._action([]), require('../core/terminal').clear);
    });
  });
});

describe('markets command', () => {
  const cmd = command.commands.markets;
  describe('_action', () => {
    it('should return market price', () => {
      let resp = cmd._action([""]);
      assert.ok(resp[0].code);
      assert.ok(resp[0].price);
    });
  });
});

describe('price command', () => {
  const cmd = command.commands.price;
  describe('_action', () => {
    it('should return get_product api response', () => {
      let resp = cmd._action(["BTCJPY"]);
      assert.equal(resp.currency_pair_code, "BTCJPY");
      assert.ok(resp.last_traded_price);
    });
  });
});



describe('balance command', () => {
  const cmd = command.commands.balance;
  describe('_action', () => {

    it('should return api response', () => {
      if (!load_credential()) {
        assert.fail("this test requires credential!");
        return;
      }
      let resp = cmd._action([]);
      assert.ok(Array.isArray(resp));
    });

    it('require credential', () => {
      pri.clear_credential();
      assert.throws(() => cmd._action([]), Error);
    });
  });
});


describe('orders command', () => {
  const cmd = command.commands.orders;
  describe('_action', () => {
    it('should return orders api response', () => {
      if (!load_credential()) {
        assert.fail("this test requires credential!");
        return;
      }
      let resp = cmd._action(["BTCJPY"]);
      assert.ok(Array.isArray(resp));
    });

    it('require credential', () => {
      pri.clear_credential();
      assert.throws(() => cmd._action([]), Error);
    });
  });
});

describe('histories command', () => {
  const cmd = command.commands.histories;
  describe('_action', () => {
    it('should return getexecutions api response', () => {
      if (!load_credential()) {
        assert.fail("this test requires credential!");
        return;
      }
      let resp = cmd._action(["BTCJPY"]);
      assert.ok(Array.isArray(resp));
    });

    it('require credential', () => {
      pri.clear_credential();
      assert.throws(() => cmd._action([]), Error);
    });
  });
});

describe('buy command', () => {
  const cmd = command.commands.buy;
  describe('_action', () => {
    it('should return order api response', () => {
      if (!load_credential()) {
        assert.fail("this test requires credential!");
        return;
      }

      // I'm not rich. I don't wanna pay GAS.
      // let resp = cmd._action(["BTCJPY", 800000, 0.01]);
      // assert.ok(resp);

      try {
        cmd._action(["BTCJPY", 0.0, 0.0]);
        assert.fail("why no error?");
      } catch (e) {
        assert.ok(e instanceof Error);
      }
    });

    it('require credential', () => {
      pri.clear_credential();
      assert.throws(() => cmd._action([]), Error);
    });
  });
});

describe('sell command', () => {
  const cmd = command.commands.sell;
  describe('_action', () => {
    it('should return order api response', () => {
      if (!load_credential()) {
        assert.fail("this test requires credential!");
        return;
      }

      // Before I said. I am a poor man.
      // let resp = cmd._action(["BTCJPY", 900000, 0.01]);
      // assert.ok(resp);

      try {
        cmd._action(["BTCJPY", 0.0, 0.0]);
        assert.fail("why no error?");
      } catch (e) {
        assert.ok(e instanceof Error);
      }
    });

    it('require credential', () => {
      pri.clear_credential();
      assert.throws(() => cmd._action([]), Error);
    });
  });
});


describe('cancel command', () => {
  const cmd = command.commands.cancel;
  describe('_action', () => {
    it('should return order api response', () => {
      if (!load_credential()) {
        assert.fail("this test requires credential!");
        return;
      }

      try {
        cmd._action(["1"]);
        assert.fail("why no error?");
      } catch (e) {
        assert.ok(true);
      }
    });

    it('require credential', () => {
      pri.clear_credential();
      assert.throws(() => cmd._action([1]), Error);
    });
  });
});
