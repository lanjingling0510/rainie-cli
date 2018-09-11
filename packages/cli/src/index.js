#!/usr/bin/env node

/*
 * @desc rainie脚手架
 * @author: rainie (chenyutian0510@gmail.com)
 * @since: 08/07/2018
 *
 */

import chalk from 'chalk';
import program from 'commander';
import WidgetMananger from './commands/widget';
import { getRainieConfig } from './utils/index.js';
// import tplAdd from './commands/tpl_add';
// import tplNew from './commands/tpl_new';
// import build from './commands/build';
// import publish from './commands/publish';


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
// program
//     .command('tpl <action>')
//     .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
//     .description('模板功能')
//     .action(async (action, cmd) => {
//       switch (action) {
//         case 'add':
//           await tplAdd(cmd);
//           break;

//         case 'new':
//           await tplNew(cmd);
//           break;

//         default:
//           break;
//       }
//     });


// /* 本地开发 */
// program
//   .command('dev [pagePath...]')
//   .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
//   .description('本地开发')
//   .action((...args) => {
//     process.env.NODE_ENV = 'development';
//     console.log(`\n${chalk.cyan('###')} 当前正在执行${chalk.red('开发环境')}的构建。\n`);
//     build(...args);
//   });


// /* 生产环境打包 */
// program
//   .command('build [pagePath...]')
//   .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
//   .description('本地打包')
//   .action((...args) => {
//     process.env.NODE_ENV = 'production';
//     console.log(`\n${chalk.cyan('###')} 当前正在执行${chalk.red('生产环境')}的构建。\n`);
//     build(...args);
//   });

//   /* 发布 */
//   program
//   .command('publish [pagePath...]')
//   .option('-c --config [config]', 'rainie cli 配置文件', './rainie.config.js')
//   .description('发布assets')
//   .action(publish);


  program.parse(process.argv);
