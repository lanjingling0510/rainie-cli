/*
 * @desc
 * @author: rainie(chenyutian0510@gmail.com)
 * @since: 08/07/2018
 *
 *
 * 线上打包
 *
 * 1. 读取项目的rainie.config.js
 * 2. 判断项目类型(组件开发/项目开发)
 * 3. 插入指定项目路径
 *
 */

import chalk from 'chalk';
import EventEmitter from 'events';
import sequence from '@rnc/plugin-sequence';
import env from '@rnc/plugin-env';
import shell from '@rnc/shell';

const error = chalk.red;
const magenta = chalk.dim.magenta;



async function build(params, cmd, context) {
  const reporter = new EventEmitter();
  const config = context.config;
  try {
    const {default: compiler} = require('@rnc/plugin-compiler-webpack');
    const {default: compilerConfig} = require('@rnc/plugin-config-app');

    /**
     * 监听消息事件
     */
    reporter.on('message', (name, msg) => {
      if (name === 'env') {
        console.log(magenta(msg));
      }
    })

    await sequence(
      env({
        'PAGE_DIR': params.join(',') || 'home',
        'PAGE_CONTEXT': config.pageContext,
        'BUILD_CONTEXT': config.buildContext,
        'LAYOUT_CONTEXT': config.layoutContext,
      }),
      compilerConfig(context.projectConfig),
      compiler(config.compilerConfig)
    )({reporter});


  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default build;
