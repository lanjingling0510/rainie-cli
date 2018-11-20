import plugin from '@rnc/plugin-core';

export default options =>
  plugin('compiler-webpack', async ({
    config
  }) => {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const openBrowser = require('react-dev-utils/openBrowser');
    const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
    const indexPageMiddleware = require('./middleware/indexPageMiddleware');
    const layoutMiddleware = require('./middleware/layoutMiddleware');
    const {
      getAvailablePort
    } = require('@rnc/utils');

    const port = process.env.DEV_PROXY_PORT || getAvailablePort(8000);
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const host = process.env.HOST || '0.0.0.0';
    const isDev = options.isDev;

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
    function runDevServer(webpackConfig) {
      var devServer = new WebpackDevServer(compiler, {
        historyApiFallback: {
          disableDotRule: true
        },
        // 启用压缩
        compress: true,
        // 不显示普通日志, 只显示 warning|error
        clientLogLevel: 'info',
        // HMR 服务
        hot: true,
        // 公共目录
        publicPath: webpackConfig.output.publicPath,
        /// 静默模式
        quiet: false,
        // 应用要显示 entry 等信息
        stats: {
          chunks: false, // Makes the build much quieter
          chunkModules: false,
          colors: true, // Shows colors in the console
          children: false,
          builtAt: true,
          modules: false
        },
        // 防止 CPU 过高
        watchOptions: {
          ignored: /node_modules/
        },
        // 支持 https 协议
        https: protocol === 'https',
        overlay: false,
        host: host,
        // 禁用 HOST 检查
        disableHostCheck: true,
        // proxy,
        before(app) {
          // init pages
          const pages = []
          for (const key in options.entry) {
            const name = key.replace(/\/index$/, '').replace(/^pages\//, '')
            const url = key.replace(/\/index$/, '') + '.html'
            const file = `${options.entry[key]}`
            pages.push({
              name,
              url,
              file
            })
          }

          // This lets us open files from the runtime error overlay.
          app.use(errorOverlayMiddleware())
          /**
           * 增加一个 router，来 HOST 页面，URL 规则为：/@${app}/${page}/index.html
           * 例：//portal.hemaos.com/@wdk-dd-home/home/index.html
           */
          app.get('/', indexPageMiddleware(pages))
          app.get('/pages/*', layoutMiddleware(options))
        }
      });

      // Launch WebpackDevServer.
      devServer.listen(port, host, (err, result) => {
        if (err) {
          return console.log(err);
        }

        openBrowser(protocol + '://' + host + ':' + port);
      });
    }


    /**
     * 生产打包阶段
     */
    function setupBuildCompiler(webpackConfig) {
      compiler = webpack(webpackConfig);
      compiler.run();
    }

    // 运行程序
    if (isDev) {
      setupCompiler(config);
      runDevServer(config);
    } else {
      setupBuildCompiler(config);
    }

  });
