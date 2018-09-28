
module.exports = {

  widget: 'univeral-component',

  // 页面应用上下文
  pageContext: process.cwd() + '/demos',

  // html模板上下文
  layoutContext: process.cwd() + '/demos',

  // 打包输出路径
  buildContext: process.cwd() + '/lib',


  dev_compilerConfig: {
    output: {
      filename: 'component.js',
      library: 'componentjs',
      libraryExport: 'default',
      libraryTarget: 'umd',
    },
  },


  build_compilerConfig: {
    output: {
      name: 'componentjs',
      file: 'component.js'
    }
  }
};
