/*
 * @desc
 * @author: rianie (chenyutian0510@gmail.com)
 * @since: 11/09/2018
 *
 * 组件核心工具
 *
 * 1. install (安装)
 * 2. execute (执行)
 * 3. uninstall (卸载)
 * 3. list (列表))
 *
 *
 * 所有组件的文件树格式：
 *├── build.js
 *|-- develop.js
 *├── publish.js
 *├── _template
 *
 */

import path from 'path';
import npm from '@rnc/plugin-npm';
import find from '@rnc/plugin-find';
import chalk from 'chalk';
import fs from 'fs-extra';
import utils, { print } from '@rnc/utils';
import { checkModule } from '../utils/index.js';
// import command from '@rnc/widget-univeral-app/lib/publish.js';

class Widget {
  constructor(config) {
    this.config = config;
    this.widgetRootPath = path.resolve(this.config.rncrcPath, 'plugins');
    this.npmClient = this.config.npmClient;
  }

  /**
   * 安装插件
   */
  async install(name) {
    if (utils.isEmpty(name)) {
      console.log(chalk.red('请输入插件名'));
      process.exit(1);
    }

    await npm(
      this.npmClient,
      `install --prefix ${this.widgetRootPath}/${name} @rnc/widget-${name}`
    )();
    console.log(chalk.green(`✔ ${name}安装成功`));
  }

  /**
   * 已安装插件列表
   */
  async list() {
    const { files } = await find(`${this.widgetRootPath}/*`)();
    const installs = [];
    for (const file of files) {
      const packageDir = path.join(file.path, 'package.json');
      const pkg = await fs.readJson(packageDir);
      installs.push([`${pkg.name}@${pkg.version}`, pkg.description]);
    }

    print.header('本地插件');
    print.list(installs, ['cyan'], '未安装插件');
  }

  /**
   * 执行插件方法
   */
  async execute(action, ...args) {
    const {commandFiles, widget} = this.config;
    const widgetDir = path.join(this.widgetRootPath, widget);
    const commandPath = path.join(widgetDir, commandFiles[action]);

    // 检测模块是否存在
    checkModule(commandPath);
    const {default: command} = require(commandPath);
    command(...args);
  }

  /**
   * 卸载插件
   */
  async uninstall(name) {
    if (utils.isEmpty(name)) {
      console.log(chalk.red('请输入插件名'));
      process.exit(1);
    }

    return fs.remove(`${this.widgetRootPath}/${name} `);
  }
}

export default Widget;
