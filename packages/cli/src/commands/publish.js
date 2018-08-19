/*
 * @desc
 * @author: rainie(chenyutian0510@gmail.com)
 * @since: 08/07/2018
 *
 *
 * 发布
 *
 * 1. 读取项目的rainie.config.js
 * 2. 判断项目类型(组件开发/项目开发)
 * 3. 插入指定项目路径
 *
 */

import chalk from 'chalk';
import EventEmitter from 'events';
import { getRainieConfig } from '../utils/index.js';
import upload from '@rnc/plugin-oss-upload';
import sequence from '@rnc/plugin-sequence';
import find from '@rnc/plugin-find';
import spinner from '@rnc/spinner';
import shell from '@rnc/shell';
import path from 'path';

const error = chalk.red;


async function build(pagePath, cmd) {
  const config = getRainieConfig(cmd.config);
  const reporter = new EventEmitter();
  const srcPath = pagePath.length > 0 ? pagePath : '*';

  try {

    /**
     * 监听消息事件
     */
    reporter.on('message', (name, data) => {
      if (name === 'oss-upload' && data.type === 'log') {
        if (data.key === 'succeed') {
          spinner.succeed(data.msg);
        } else if (data.key === 'fail') {
          spinner.fail(data.msg);
        } else {
          console.log(data.msg);
        }
      }
    })


    sequence(
      find(srcPath, {
        expandDirectories: true,
        cwd: path.join(config.buildContext, 'pages')
      }),
      upload({
        cwd: config.buildContext,
        force: true,
      })
    )({reporter});


  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default build;
