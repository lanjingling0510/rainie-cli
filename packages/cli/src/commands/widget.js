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
import npm from '@rnc/npm';
import chalk from 'chalk';
import fs from 'fs-extra';
import find from '@rnc/plugin-find';
import copy from '@rnc/plugin-copy';
import npmPlugin from '@rnc/plugin-npm';
import sequence from '@rnc/plugin-sequence';
import utils, { print, file, net } from '@rnc/utils';
import { checkModule } from '../utils/index.js';

class Widget {
  constructor(context) {
    this.context = context;
    this.config = context.config;
    this.widgetRootPath = this.config.widgetRootPath;
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

    const pkgName = `@rnc/widget-${name}`;
    const pluginDir = path.join(this.widgetRootPath, name);

    // 确保插件根目录存在
    await fs.ensureDir(this.widgetRootPath);

    // 获取npm信息
    let result = await npm.getInfo(pkgName);

    if (!result) {
      console.log(chalk.red(`未找到插件 ${name} 的 NPM 包信息: ${pkgName}`));
      process.exit(1);
    }

    const pkgVersion = result['dist-tags'].latest;
    const npmInfo = result.versions[pkgVersion];
    console.log(
      chalk.yellow(
        `[i] 获取插件 npm 包: name = ${npmInfo.name}, version = ${
          npmInfo.version
        }`
      )
    );

    // 下载插件 zip
    const tmpDir = file.tmpdir(true);
    console.log(tmpDir)
    try {
      console.log(
        chalk.yellow(`[i] 下载插件 zip 包: tarball = ${npmInfo.dist.tarball}`)
      );
      await net.download(npmInfo.dist.tarball, tmpDir);

      await sequence(
        find(path.join(tmpDir, 'package')),
        copy(pluginDir),
        npmPlugin(this.config.npmClient, 'install', { cwd: pluginDir })
      )();
    } finally {
      await fs.remove(tmpDir);
    }

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
    const cmdPath = path.isAbsolute(action)
      ? action
      : this.getCurrentWidgetFilePath(action);

    // 检测模块是否存在
    checkModule(cmdPath);
    const { default: command } = require(cmdPath);
    command.apply(this.context, args);
  }

  /**
   * 卸载插件
   */
  async uninstall(name) {
    if (utils.isEmpty(name)) {
      console.log(chalk.red('请输入插件名'));
      process.exit(1);
    }

    await fs.remove(`${this.widgetRootPath}/${name}`);
    console.log(chalk.green(`✔ ${name}卸载成功`));
  }

  /**
   * 链接插件
   */
  async link(name) {
    if (utils.isEmpty(name)) {
      console.log(chalk.red('请输入插件名'));
      process.exit(1);
    }

    const srcPath = await utils.input('插件根路径', '.');
    const abSrcPath = await fs.realpath(srcPath);
    const destPath = path.join(this.widgetRootPath, name);
    await fs.remove(destPath);
    await fs.ensureSymlink(abSrcPath, destPath);
    console.log(chalk.green(`✔ ${name}链接成功`));
  }

  /**
   * 取消链接插件
   */
  async unlink(name) {
    this.uninstall(name);
  }

  getCurrentWidgetFilePath(file) {
    const name = this.config.widget;
    if (name) {
      const widgetDir = path.join(this.widgetRootPath, name);
      return path.join(widgetDir, file);
    }
  }

  getCurrentWidgetConfig() {
    const pkgPath = this.getCurrentWidgetFilePath('package.json');
    if (!pkgPath) {
      return {};
    }

    checkModule(pkgPath);
    return require(pkgPath).rnc || {};
  }
}

export default Widget;
