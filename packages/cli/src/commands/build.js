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
import { getRainieConfig, checkModule } from '../utils/index.js';
import sequence from '@rnc/plugin-sequence';
import env from '@rnc/plugin-env';
import shell from '@rnc/shell';

const error = chalk.red;
const magenta = chalk.dim.magenta;



async function build(pagePath, cmd) {
  const config = getRainieConfig(cmd.config);
  const reporter = new EventEmitter();

  try {

    // 检测模块是否存在
    checkModule(`@rnc/plugin-compiler-${config.compiler}`);
    checkModule(`@rnc/plugin-type-${config.type}`);

    const {default: compiler} = require(`@rnc/plugin-compiler-${config.compiler}`);
    const {default: type} = require(`@rnc/plugin-type-${config.type}`);

    /**
     * 监听消息事件
     */
    reporter.on('message', (name, msg) => {
      if (name === 'env') {
        console.log(magenta(msg));
      }
    })

    sequence(
      env({
        'PAGE_DIR': pagePath[0],
        'PAGE_CONTEXT': config.pageContext,
        'LAYOUT_CONTEXT': config.layoutContext
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
