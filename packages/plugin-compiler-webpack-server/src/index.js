import plugin from '@rnc/plugin-core';

export default webpackConfig =>
  plugin('compiler-webpack-server', async ({defaultConfig}) => {

    const path = require('path');
    const webpack = require('webpack');
    const webpackMerge = require('webpack-merge');
    const nodemon = require('nodemon');
    const once = require('ramda').once;
    const isDev =  process.env.NODE_ENV === 'development';

    webpackConfig = webpackMerge(defaultConfig, webpackConfig);

    // Tools like Cloud9 rely on this.
    let compiler;


    /**
     * 开发打包阶段
     */
    function setupCompiler(webpackConfig) {
      compiler = webpack(webpackConfig);

    }


    /**
     * 开发阶段阶段服务器
     */
    function runDevServer() {
      const serverPaths = Object
        .keys(compiler.options.entry)
        .map(entry => path.join(compiler.options.output.path, `${entry}.js`))

      nodemon({ script: serverPaths[0], watch: serverPaths, nodeArgs: process.argv.slice(2) })
        .on('quit', process.exit)
    }

    const runDevServerOnce = once((err, stats) => {
      if (err) return
      runDevServer();
    })

    process.on('SIGINT', () => {
      console.log('😗  Good Bye ~');
      process.exit(0);
    });



    /**
     * 生产打包阶段
     */
    function setupBuildCompiler(webpackConfig) {
      compiler = webpack(webpackConfig);
      compiler.run();
    }

    // 运行程序
    if (isDev) {
      setupCompiler(webpackConfig);
      compiler.watch(webpackConfig.watchOptions || {}, runDevServerOnce)
    } else {
      setupBuildCompiler(webpackConfig);
    }

  });
