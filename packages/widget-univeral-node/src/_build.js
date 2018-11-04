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



async function build(params, cmd, config) {
  const reporter = new EventEmitter();

  try {

    const {default: compiler} = require('@rnc/plugin-compiler-webpack-server');
    const {default: type} = require('@rnc/plugin-config-node-server');

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
        'PAGE_CONTEXT': config.pageContext,
        'BUILD_CONTEXT': config.buildContext,
      }),
      type,
      compiler(config.compilerConfig)
    )({reporter});


  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default build;
