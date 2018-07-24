export default {

    /*
     * addp
     */

    // 模板仓库
    repositories: [
      {
        owner: 'lanjingling0510',
        registry: 'widget-kit',
        desc: 'component-webpack-模板'
      }, {
        owner: 'local',
        registry: 'app-webpack-react-kit',
        desc: 'app-webpack-react-模板'
      }
    ],


    /*
     * dev
     */

    // 项目类型(app 或 component)
    type: 'app/webpack',

    // 页面应用上下文
    pageContext: process.cwd() + '/src/pages',

    // html模板上下文
    layoutContext: process.cwd() + '/demos',

    // 本地开发服务配置
    devServer: {
      port: 8000,
    }
};
