/*
 * @desc
 * @author: wb-cyt420097 (wb-cyt420097@alibaba-inc.com)
 * @since: 08/07/2018
 *
 *
 * 添加模板
 *
 * 1. 拉取github仓库的模板列表
 * 2. 选择模板
 * 3. 插入指定项目路径
 * 4. 安装npm依赖
 *
 */

import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import EventEmitter from 'events';
import { getRainieConfig } from '../utils/index.js';

import utils from '@rnc/utils';
import find from '@rnc/plugin-find';
import sequence from '@rnc/plugin-sequence';
import copy from '@rnc/plugin-copy';
import spinner from '@rnc/spinner';
import shell from '@rnc/shell';

const error = chalk.red;

/**
 *添加模板
 *
 * @param {*} tplName 模板名称
 * @param {*} tplPath 模板路径
 */
async function newp(cmd) {
  const config = getRainieConfig(cmd.config);

  try {

    // 选择生成路径
    const tplPath = await utils.input('输入添加的模板路径', '.');
    const realPath = await fs.realpath(tplPath);
    const tplName = path.basename(realPath);
    const destination = path.join(config.templatePath, tplName);
    const reporter = new EventEmitter();


    /**
     * 监听小溪事件
     */
    reporter.on('message', (name, data) => {
      const msgMap = {
        'copy': {
          'spinner': {
            'start': '添加模板...',
            'succeed': '添加模板成功'
          }
        }
      };

      const message = msgMap[name][data.type][data.key];

      if (data.type === 'spinner') {
        spinner[data.key](message);
      }
    })

    // 执行程序
    await sequence(
      find(tplPath),
      copy(destination),
    )({
      reporter: reporter,
    });

    shell.exit(1);
  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default newp;
