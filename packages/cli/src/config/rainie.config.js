import {getRootPath} from '../utils/index.js';

export default {


    // 模板仓库
    templatePath: getRootPath('_template'),


    // npm命令
    npmClient: "tnpm",


    // 项目类型(app 或 component)
    type: 'app',

    // 编译工具
    compiler: 'webpack',

    // 编译配置
    compilerConfig: {},

    // 页面应用上下文
    pageContext: process.cwd() + '/src/pages',

    // html模板上下文
    layoutContext: process.cwd() + '/demos',

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
