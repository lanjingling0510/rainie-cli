#!/usr/bin/env node

/*
 * @desc rainie脚手架
 * @author: rainie (chenyutian0510@gmail.com)
 * @since: 08/07/2018
 *
 */

import program from 'commander';
import WidgetMananger from './commands/widget';
import { getRainieConfig } from './utils/index.js';
import tplAdd from './commands/tpl_add';
import tplNew from './commands/tpl_new';

program
    .version(require('../package.json').version, '-v, --version');


program
    .command('plugin [command...]')
    .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
    .description('插件功能')
    .action(async (args, cmd) => {
      const config = getRainieConfig(cmd.config);
      const widgetMananger = new WidgetMananger(config);
      const command = args[0];
      const params = args.slice(1);
      widgetMananger[command](...params);
    });

// /* 模板 */
program
    .command('tpl <action>')
    .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
    .description('模板功能')
    .action(async (action, cmd) => {
      switch (action) {
        case 'add':
          await tplAdd(cmd);
          break;

        case 'new':
          await tplNew(cmd);
          break;

        default:
          break;
      }
    });

/* 本地开发 */
program
  .command('dev [pagePath...]')
  .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
  .description('本地开发')
  .action((params, cmd) => {
    const command = 'dev';
    const config = getRainieConfig(cmd.config);
    const widgetMananger = new WidgetMananger(config);
    widgetMananger.execute(command, params, cmd, config);
  });


/* 生产环境打包 */
program
  .command('build [pagePath...]')
  .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
  .description('本地打包')
  .action((params, cmd) => {
    const command = 'build';
    const config = getRainieConfig(cmd.config);
    const widgetMananger = new WidgetMananger(config);
    widgetMananger.execute(command, params, cmd, config);
  });

  /* 发布 */
  program
  .command('publish [pagePath...]')
  .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
  .description('发布assets')
  .action((params, cmd) => {
    const command = 'publish';
    const config = getRainieConfig(cmd.config);
    const widgetMananger = new WidgetMananger(config);
    widgetMananger.execute(command, params, cmd, config);
  });


  program.parse(process.argv);
