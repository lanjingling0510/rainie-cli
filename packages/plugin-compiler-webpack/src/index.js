import plugin from '@rnc/plugin-core';

export default webpackConfig =>
  plugin('compiler-webpack', async ({defaultConfig}) => {

    const chalk = require('chalk');
    const webpack = require('webpack');
    const webpackMerge = require('webpack-merge');
    const WebpackDevServer = require('webpack-dev-server');
    const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
    const openBrowser = require('react-dev-utils/openBrowser');
    const { default: spinner } = require('@rnc/spinner');
    const { getAvailablePort } = require('@rnc/utils');

    const port = process.env.DEV_PROXY_PORT || getAvailablePort(8000);
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const host = process.env.HOST || '0.0.0.0';
    const pageDir = (process.env.PAGE_DIR || '*').split(',');
    const isDev =  process.env.NODE_ENV === 'development';

    webpackConfig = webpackMerge(defaultConfig, webpackConfig);

    // Tools like Cloud9 rely on this.
    let compiler;


    /**
     * 开发打包阶段
     */
    function setupCompiler(webpackConfig) {
      // "Compiler" is a low-level interface to Webpack.
      // It lets us listen to some events and provide our own custom messages.
      compiler = webpack(webpackConfig);

      // "invalid" event fires when you have changed a file, and Webpack is
      // recompiling a bundle. WebpackDevServer takes care to pause serving the
      // bundle, so if you refresh, it'll wait instead of serving the old one.
      // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
      compiler.hooks.invalid.tap('server', function() {
        // clearConsole();
        spinner.start('编译中...');
      });

      let isFirstCompile = true;
      let prevModules;

      compiler.hooks.done.tap('server', function(stats) {
        const messages = formatWebpackMessages(stats.toJson({}, true));
        const isSuccessful = !messages.errors.length && !messages.warnings.length;
        const showInstructions = isSuccessful && isFirstCompile;

        // 检测源文件
        if (isSuccessful) {
          const currModules = {};
          const newModules = {};
          const changedModules = {};
          const removedModules = {};

          stats.compilation.modules.forEach(function(module) {
            // skip modules which don't have a resource property (e.g. main module 0)
            if (!module.resource) return;

            currModules[module.id] = {
              buildTimestamp: module.buildTimestamp,
              resource: module.resource
            };

            // if prevModules exists, check if current module is new or has changed
            if (prevModules) {
              if (!prevModules[module.id]) {
                // current module is new
                console.log(chalk.green('新建文件: ' + module.resource));
                newModules[module.id] = module.resource;
              } else if (
                prevModules[module.id].buildTimestamp !== module.buildTimestamp
              ) {
                // current module has changed
                console.log(chalk.yellow('更新文件: ' + module.resource));
                changedModules[module.id] = module.resource;
              }
            }
          });

          // if prevModules exists, check for removed modules
          if (prevModules) {
            Object.keys(prevModules).forEach(function(id) {
              if (!currModules[id]) {
                // module was removed
                console.log(chalk.red('删除文件: ' + prevModules[id].resource));
                removedModules[id] = prevModules[id].resource;
              }
            });
          }

          prevModules = currModules;
        }

        // 初始化构建成功
        if (showInstructions) {
          console.log(chalk.green('✔ 构建成功'));
          console.log();
          console.log();
          console.log('The app is running at:');
          console.log();
          console.log(
            '  ' +
              chalk.cyan(
                protocol +
                  '://' +
                  host +
                  ':' +
                  port +
                  '/pages/' +
                  pageDir[0] +
                  '/index.html'
              )
          );
          console.log();
          console.log();
          isFirstCompile = false;
        }

        // 重新编译成功
        else if (isSuccessful) {
          spinner.succeed('编译完成.');
        }

        // 显示错误
        if (messages.errors.length) {
          console.log(chalk.red('Failed to compile.'));
          console.log();
          messages.errors.forEach(message => {
            console.log(message);
            console.log();
          });
          return;
        }

        // 显示警告
        if (messages.warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.'));
          console.log();
          messages.warnings.forEach(message => {
            console.log(message);
            console.log();
          });
          // Teach some ESLint tricks.
          console.log('You may use special comments to disable some warnings.');
          console.log(
            'Use ' +
              chalk.yellow('// eslint-disable-next-line') +
              ' to ignore the next line.'
          );
          console.log(
            'Use ' +
              chalk.yellow('/* eslint-disable */') +
              ' to ignore all warnings in a file.'
          );
        }
      });
    }

    /**
     * 开发阶段阶段服务器
     */
    function runDevServer(webpackConfig) {
      var devServer = new WebpackDevServer(compiler, {
        historyApiFallback: true,
        // Enable gzip compression of generated files.
        compress: true,
        // Silence WebpackDevServer's own logs since they're generally not useful.
        // It will still show compile warnings and errors with this setting.
        clientLogLevel: 'none',
        // Enable hot reloading server. It will provide /sockjs-node/ endpoint
        // for the WebpackDevServer client so it can learn when the files were
        // updated. The WebpackDevServer client is included as an entry point
        // in the Webpack development configuration. Note that only changes
        // to CSS are currently hot reloaded. JS changes will refresh the browser.
        hot: true,
        // It is important to tell WebpackDevServer to use the same "root" path
        // as we specified in the config. In development, we always serve from /.
        publicPath: '/',
        // WebpackDevServer is noisy by default so we emit custom message instead
        // by listening to the compiler events with `compiler.plugin` calls above.
        quiet: true,
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: {
          ignored: /node_modules/
        },
        // Enable HTTPS if the HTTPS environment variable is set to 'true'
        https: protocol === 'https',

        host: host,

        disableHostCheck: true
      });

      // Launch WebpackDevServer.
      devServer.listen(port, host, (err, result) => {
        if (err) {
          return console.log(err);
        }

        openBrowser(
          protocol + '://' + host + ':' + port + '/pages/' + pageDir[0] + '/index.html'
        );
      });
    }


    /**
     * 生产打包阶段
     */
    function setupBuildCompiler(webpackConfig) {
      compiler = webpack(webpackConfig);

      compiler.run();

      let isFirstCompile = true;

      compiler.hooks.done.tap('server', function(stats) {
        const messages = formatWebpackMessages(stats.toJson({}, true));
        const isSuccessful = !messages.errors.length && !messages.warnings.length;
        const showInstructions = isSuccessful && isFirstCompile;

        // 初始化构建成功
        if (showInstructions) {
          console.log(chalk.green('✔ 构建成功'));
          console.log();
          console.log();
          isFirstCompile = false;
        }
      })

    }


    // 运行程序
    if (isDev) {
      setupCompiler(webpackConfig);
      runDevServer(webpackConfig);
    } else {
      setupBuildCompiler(webpackConfig);
    }

  });
