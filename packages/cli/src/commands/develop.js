/*
 * @desc
 * @author: wb-cyt420097 (wb-cyt420097@alibaba-inc.com)
 * @since: 08/07/2018
 *
 *
 * 本地开发
 *
 * 1. 读取项目的rainie.config.js
 * 2. 判断项目类型(组件开发/项目开发)
 * 3. 插入指定项目路径
 *
 */

import fs from 'fs';
import chalk from 'chalk';
import { getRainieConfig, getScaffoldConfig } from '../utils/configUtils';
import { getScaffoldPath } from '../utils/pathUtils';
import utils from '../utils/utils';

// const error = chalk.red;
// const success = chalk.green;
// const promptMessage = chalk.blue('>>>') + ': ';

async function develop(pagePath, cmd) {

  console.log(`\n${chalk.cyan('###')} 当前正在执行${chalk.red('开发环境')}的构建。\n`);

  const config = getRainieConfig(cmd.config);

  // 设置进程变量
  process.env.NODE_ENV = 'development';
  process.env.PAGE_DIR = pagePath;
  process.env.PAGE_CONTEXT = config.pageContext;
  process.env.DEV_PROXY_PORT = utils.getAvailablePort(config.devServer.port);
  process.env.LAYOUT_CONTEXT = config.layoutContext;

  // 检测当前脚手架
  checkScaffold(config.type);

  let pieces = config.type.split('/');
  let group = pieces[0];
  let name = pieces[1];

  // webpack编译的项目
  if (group === 'app' && name === 'webpack') {
    // 获取webpack配置
    const webpackConfig = getScaffoldConfig(group, name, config.webpackConfig);
    const serverPath = getScaffoldPath(config.type, 'scripts', 'server.js');
    const devServer = require(serverPath);
    devServer(webpackConfig);
  }
}

/**
 * 检测脚手架是否存在
 * @param {string} type 项目类型
 */
function checkScaffold(type) {
  if (!fs.existsSync(getScaffoldPath(type))) {
    console.error(chalk.red('不支持脚手架: %s'), type);
    return false;
  }

  return true;
}

export default develop;
