#!/usr/bin/env node


import { getRainieConfig } from './utils';
import Rnc from './commands/rnc';

function main() {
  const version = require('../package.json').version;
  const config = getRainieConfig('./rainie.config.js');
  const rnc = new Rnc(version, config);
  rnc.runCommand();
}

main();
