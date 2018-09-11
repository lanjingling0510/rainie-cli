
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
 *├── publish.js
 *├── _template
 *
 */

import path from 'path';
import npm from '@rnc/plugin-npm';
import find from '@rnc/plugin-find';
import chalk from 'chalk';
// import {print} from '@rnc/utils';

class Widget {
  constructor(config) {
    this.config = config;
    this.widgetRootPath = path.join(this.config.rncrcPath, 'plugins');
    this.npmClient = this.config.npmClient;
  }


  async install(widget) {
    await npm(this.npmClient, `install --prefix ${this.widgetRootPath} ${widget}`)();
    console.log(chalk.green(`✔ ${widget}安装成功`));
  }

  async list() {
    const {files: plugins} = await find(this.widgetRootPath)();
    console.log(plugins);
    // for (let name in plugins) {
    //   let plugin = plugins[name]
    //   let cols = [
    //     `${name}@${plugin.version}`,
    //     plugin.desc + chalk.yellow(plugin.debug ? ' (调试中)' : '')
    //   ]

    //   if (plugin.type === 'internal') {
    //     internals.push(cols)
    //   } else {
    //     installs.push(cols)
    //   }
    // }

    // print.header('本地插件');
    // print.list(installs, ['cyan'], '未安装插件')
  }


  execute() {

  }

  uninstall() {

  }
}

export default Widget;
