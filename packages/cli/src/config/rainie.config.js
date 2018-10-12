import path from 'path';
import os from 'os';

export default {
  // 配置文件和widget的根目录
  rncrcPath: path.join(os.homedir(), '.rncrc'),

  // 插件根目录
  widgetRootPath: path.join(os.homedir(), '.rncrc', 'plugins'),

  // 命令
  commands: [
    {
      name: 'plugin',
      desc: '插件功能',
      arguments: '<action> [args...]',
      options: [],
      action: path.join(__dirname, '../commands/command_plugin.js')
    },
    {
      name: 'tpl',
      desc: '模板功能',
      arguments: '<action>',
      options: [],
      action: path.join(__dirname, '../commands/command_tpl.js')
    },
  ],

  // npm命令
  npmClient: 'npm',

  // 插件
  widget: '',

  // 页面应用上下文
  pageContext: process.cwd() + '/src/pages',

  // html模板上下文
  layoutContext: process.cwd() + '/demos',

  // 输出上下文
  buildContext: process.cwd() + '/build',

  // 本地开发服务配置
  devServer: {
    port: 8000
  },

  // 环境
  env: {
    development: {},
    production: {}
  }
};
