import chalk from 'chalk';

async function pluginCommand(action, ...args) {
  const context = this;
  switch (action) {
    case 'install':
      await install.apply(context, args);
      break;

    case 'list':
      await list.apply(context, args);
      break;

    case 'uninstall':
      await uninstall.apply(context, args);
      break;
    case 'link':
      await link.apply(context, args);
      break;
    case 'unlink':
      await unlink.apply(context, args);
      break;

    default:
      console.log(chalk.yellow(`- 没有注册命令:rnc plugin ${action}`));
      break;
  }
}

/**
 * 安装插件
 */
async function install(name) {
  return this.widgetMananger.install(name);
}

/**
 * 已安装插件列表
 */
async function list() {
  return this.widgetMananger.list();
}

/**
 * 卸载插件
 */
async function uninstall(name) {
  return this.widgetMananger.uninstall(name);
}

/**
 * 链接插件
 */
async function link(name) {
  return this.widgetMananger.link(name);
}

/**
 * 取消链接插件
 */
async function unlink(name) {
  return this.widgetMananger.unlink(name);
}

export default pluginCommand;
