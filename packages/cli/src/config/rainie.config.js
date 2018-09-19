
import path from 'path';
import os from 'os';

export default {

    // 配置文件和widget的根目录
    rncrcPath: path.join(os.homedir(), '.rncrc'),



    // 命令文件映射
    commandFiles: {
      dev: 'lib/develop.js',
      build: 'lib/build.js',
      publish: 'lib/publish.js',
      _template: '_template',
    },


    // npm命令
    npmClient: "npm",


    // 插件
    widget: 'univeral-app',

    // 编译配置
    compilerConfig: {},

    // 页面应用上下文
    pageContext: process.cwd() + '/src/pages',

    // html模板上下文
    layoutContext: process.cwd() + '/demos',

    // 输出上下文
    buildContext: process.cwd() + '/build',

    // 本地开发服务配置
    devServer: {
      port: 8000,
    },

    // 环境
    env: {
      development: {

      },
      production: {

      }
    },



};
