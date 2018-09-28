import path from 'path';
import Commander from './commander';
import Widget from './widget';

class Rnc {
  constructor (version, config) {

    /**
     * 配置
     */
    this.config = config;

    /**
     * 版本
     */
    this.version = version;

    /**
     * 项目配置
     */
    this.projectConfig = require(path.resolve('package.json'));


    /**
     * 插件管理
     */
    this.widgetMananger = new Widget(this);

    /**
     * 当前插件配置
     */
    this.widgetConfig = this.widgetMananger.getCurrentWidgetConfig();

    /**
     * 当前命令配置
     */
    this.commands = this.config.commands.concat(this.widgetConfig.commands || []);

    /**
     * 命令行生成器
     */
    this.commander = new Commander(version, this);

    this.registerCommands();
  }



  /**
   * 注册命令
   */
  registerCommands() {
    const commands = this.commands;
    for (const command of commands) {
      this.commander.register(command);
    }
  }

  runCommand() {
    this.commander.run();
  }
}

export default Rnc;
