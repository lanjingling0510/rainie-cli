/*
 * @desc
 * @author: rainie(chenyutian0510@gmail.com)
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
import EventEmitter from 'events';
import { getRainieConfig } from '../utils/index.js';

import utils from '@rnc/utils';
import find from '@rnc/plugin-find';
import sequence from '@rnc/plugin-sequence';
import select from '@rnc/plugin-select';
import copy from '@rnc/plugin-copy';
import npm from '@rnc/plugin-npm';
import spinner from '@rnc/spinner';
import shell from '@rnc/shell';
import path from 'path';

const error = chalk.red;

/**
 *添加模板
 *
 * @param {*} tplName 模板名称
 * @param {*} tplPath 模板路径
 */
async function addp(cmd) {
  const config = getRainieConfig(cmd.config);

  try {

    // 选择生成路径
    const destPath = await utils.input('输入生成路径', '.');

    const reporter = new EventEmitter();

    const widgetRootPath = path.resolve(config.rncrcPath, 'plugins');


    /**
     * 监听消息事件
     */
    reporter.on('message', (name, data) => {
      const msgMap = {
        'copy': {
          'spinner': {
            'start': '拉取模板...',
            'succeed': '模板拉取成功'
          }
        }
      };

      const message = msgMap[name][data.type][data.key];

      if (data.type === 'spinner') {
        spinner[data.key](message);
      }
    })


    const {files} = await sequence(
      find(widgetRootPath + '/*', {ignore: [path.join(widgetRootPath, '.DS_Store')]}),
      select('选择插件'),
    )();

    const templatePath = path.join(files[0].path, '_template');

    // 执行程序
    await sequence(
      find(templatePath + '/*', {ignore: [path.join(templatePath, '.DS_Store')]}),
      select('选择模板'),
      copy(destPath),
      npm(config.npmClient, 'install')
    )({
      reporter: reporter,
    });

    shell.exit(1);
  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default addp;
