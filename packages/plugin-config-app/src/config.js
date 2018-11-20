import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import { print } from '@rnc/utils';
import webpack from 'webpack';
import chalk from 'chalk';
import path from 'path';
import { getAppEntry, getAppTemplate, getRule } from '@rnc/builder-helper';

const cwd = process.cwd();

module.exports = options => {
  const entry = getAppEntry(options);
  print.header('入口页面');
  print.list(Object.keys(entry).map((key, index) => [`[${index + 1}]`, key]), ['cyan']);

  /**
  |--------------------------------------------------
  | 配置信息
  |--------------------------------------------------
  */

  // 标准配合
  const config = {
    entry: entry,

    mode: options.nodeEnv,

    output: {
      // 构建目录
      path: options.buildContext,
      // 文件名
      filename: '[name].js',
      // chunk 文件名
      chunkFilename: '[chunkhash].js'
    },

    resolve: {
      symlinks: false,
      // 支持扩展名
      extensions: ['.js', '.jsx'],
      // 预定义的alias
      alias: {
        components: path.join(cwd, 'src/components'),
        pages: path.join(cwd, 'src/pages'),
        styles: path.join(cwd, 'src/styles'),
        utils: path.join(cwd, 'src/utils'),
        widget: path.join(cwd, 'src/widget'),
        common: path.join(cwd, 'src/common'),
        'react-hot-loader': require.resolve('react-hot-loader'),
        // 解决：当rainie-ci是symlinked的时候,@babel/runtime从源码引用失败
        '@babel/runtime': path.dirname(
          require.resolve('@babel/runtime/package.json')
        )
      }
    },
    module: {
      rules: [
        // 加载 js
        {
          id: 'id',
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            cacheDirectory: true,
            highlightCode: true,
            plugins: [
              require.resolve('react-hot-loader/babel'),
              [
                require.resolve('@babel/plugin-proposal-decorators'),
                { legacy: true }
              ],
            ],
            presets: [require.resolve('babel-preset-react-app')]
          }
        },

        // 加载 css
        {
          id: 'css',
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: options.isDev
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                config: {
                  path: path.join(__dirname, 'postcss.config.js')
                }
              }
            }
          ]
        }
      ]
    },

    // 自定义externals
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes'
    },

    optimization: {
      noEmitOnErrors: true,
      concatenateModules: true
    },

    plugins: [
      // 清空之前build目标目录
      new CleanWebpackPlugin([options.buildContext], {
        root: cwd,
        verbose: false
      }),

      // 定义代码环境变量
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.nodeEnv)
      }),

      // 显示构建进度
      new ProgressBarPlugin(),

      // 处理 .Locale 文件
      new webpack.IgnorePlugin(/\.\/locale$/, /moment$/)
    ]
  };


  /**
  |--------------------------------------------------
  | 可选配置
  |--------------------------------------------------
  */

  // 打包html模板
  if (options.buildTemplate) {
    const tpls = getAppTemplate(entry, options);
    const HtmlWebpackPluginMap = tpls.map(config => new HtmlWebpackPlugin(config));
    config.plugins.unshift(...HtmlWebpackPluginMap);
  }

  // 构建特性
  if (options.feature) {
    if (options.feature.wrapper) {
      console.log(chalk.cyan('INFO:'), '已开启 element-wrapper 支持');
      const ruleJs = getRule(config.module.rules, 'js');
      ruleJs.use[0].options.plugins.push(require.resolve('babel-plugin-element-wrapper'))
    }
  }


  /**
  |--------------------------------------------------
  | 开发配置
  |--------------------------------------------------
  */

  if (options.isDev) {
    config.output.publicPath = '/';
    config.devtool = 'cheap-module-eval-source-map';
    config.optimization.namedModules = true;

    const ruleCss = getRule(config.module.rules, 'css');

    ruleCss.use.unshift({
      loader: require.resolve('style-loader')
    });

    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  } else {

    /**
    |--------------------------------------------------
    | 生产配置
    |--------------------------------------------------
    */

    // config.devtool = 'source-map'

    config.output.publicPath = `//static-assets.cyt-rain.cn/${options.name}/${options.version}/`;
    const ruleCss = getRule(config.module.rules, 'css');
    ruleCss.use.unshift({
      loader: MiniCssExtractPlugin.loader
    });

    config.plugins.unshift(
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        extractComments: false,
        uglifyOptions: {
          ecma: 8,
          warnings: false,
          compress: {
            pure_funcs: ['console.log'],
            drop_debugger: true
          },
          output: {
            comments: false,
            beautify: false
          },
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        }
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    );
  }


  // 删除所有 Loader 上的 id
  for (const item of config.module.rules) {
    delete item.id;
  }

  return config;
};
