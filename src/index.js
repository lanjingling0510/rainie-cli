#!/usr/bin/env node

/*
 * @desc rainie脚手架
 * @author: rainie (chenyutian0510@gmail.com)
 * @since: 08/07/2018
 *
 */

import program from 'commander';
import addp from './commands/addp';
import develop from './commands/develop';




program
    .version(require('../package.json').version, '-v, --version');


/* 添加模板 */
program
    .command('addp')
    .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
    .description('添加模板')
    .action(addp);

/* 本地开发 */
program
  .command('dev <pagePath>')
  .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
  .description('本地开发')
  .action(develop);


/* ci发布 */



  program.parse(process.argv);
