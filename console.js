#!/usr/bin/env node

"use strict";

require('./core/polyfill');

const repl = require('repl');

const term = require('./core/terminal');
const command = require('./core/command');

const api = require('./quoinex/api');
const pub = require('./quoinex/builder/pub');
const pri = require('./quoinex/builder/pri');

const version = require('./package.json').version;
const banner = `${term.yellow}${term.bold}
    __ _ _   _  __ _  ___
   / _\` | | | |/ _\` |/ __|
  | (_| | |_| | (_| | (__
   \\__, |\\__,_|\\__,_|\\___|
      | |
      |_|
${term.reset}${term.yellow}
  liquid (quoine) - api - console
${term.reset}

  コンテキスト変数:
    api      -> APIクライアント
    pub      -> パブリックAPI
    pri      -> プライベートAPIと認証

  コマンド:
    .help または .qu_* help を参照
    > .qu_buy help

  APIドキュメント:
    quoine API - https://developers.quoine.com

  例:
    > pri.set_credential(YOUR_API_ID, YOUR_API_SECRET)
    > pri.getorders.create()
    > _.currency_pair_code("btcjpy").status("live")
    > _.executeSync()


`;

const loadCredential = () => {
  try {
    const config = require('./.credential.json');
    if (config.api_key && config.api_secret) {
      pri.set_credential(config.api_key, config.api_secret);
      console.log(term.colorful(term.green, "  (.credential.json loaded)\n\n"));
    }
  } catch (e) {
    // not found
  }
};

const initContext = (context) => {
  context.api = api;
  context.pub = pub;
  context.pri = pri;
};


const main = (program) => {

  if (!program.nobanner) {
    process.stdout.write(term.clear);
    process.stdout.write(term.nl);
    process.stdout.write(banner);
  }

  loadCredential();

  let server = repl.start('> ');

  initContext(server.context);
  server.on('reset', initContext);

  Object.values(command.commands)
    .forEach(cmd => server.defineCommand(cmd.getName(), {
      help: cmd.getHelp(),
      action(arg) {
        cmd.doAction(server, arg);
      }
    }));
};


const program = require('commander');
program
  .version(require("./package.json").version)
  .description("liquid (quoine) - api - console")
  .option("-n, --no-banner", "Don't show ugly startup banner", false)
  .on("--help", () => {
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ node console.js -n");
    console.log("");
  })
  .parse(process.argv);

main(program);
