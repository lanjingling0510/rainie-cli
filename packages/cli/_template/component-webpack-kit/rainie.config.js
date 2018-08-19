const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  // 项目类型(app 或 component)
  type: 'component',

  // 页面应用上下文
  pageContext: process.cwd() + '/demos',

  // html模板上下文
  layoutContext: process.cwd() + '/demos',

  // 打包输出路径
  buildContext: process.cwd() + '/lib',


  env: {
    development: {
      compiler: 'webpack',
      compilerConfig: {
        output: {
          filename: 'component.js',
          library: 'componentjs',
          libraryExport: 'default',
          libraryTarget: 'umd',
        },
      }
    },

    production: {
      compiler: 'rollup',
      compilerConfig: {
        output: {
          name: 'componentjs',
          file: 'component.js'
        }
      }
    }
  }
};
