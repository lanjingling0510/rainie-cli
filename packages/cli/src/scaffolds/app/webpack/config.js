import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import chalk from 'chalk';
import path from 'path';
import globby from 'globby';
import fs from 'fs';


const cwd = process.cwd();
const isDev = process.env.NODE_ENV === 'development';
const pageDir = (process.env.PAGE_DIR || '*').split(',');
const pageContext = process.env.PAGE_CONTEXT;
const layoutContext = process.env.LAYOUT_CONTEXT;

/**
 * 设置入口文件
 * 遍历目录，遇到index.js则不再深入
 */
const getPathMaps = () => {
  const entry = {};
  const template = {};

  const dirs = globby.sync(pageDir, {
    cwd: pageContext
  });

  dirs.forEach(item => {
    const tplPath = path.join(layoutContext, item + '.html');
    const entryPath = path.join(pageContext, item, 'index.js');
    // 入口文件存在
    if (fs.existsSync(entryPath)) {
      let existsTemplate = fs.existsSync(tplPath);

      // template
      template[`pages/${item}/index`] = {
        name: `${item}.html`,
        existsTemplate: existsTemplate,
        template: existsTemplate
          ? tplPath
          : path.join(__dirname, 'layout', 'index.html')
      };

      // entry
      entry[`pages/${item}/index`] = [
        require.resolve('react-dev-utils/webpackHotDevClient'),
        entryPath
      ];
    }
  });

  return {
    entry,
    template
  };
};

/**
 * 设置HtmlWebpackPlugin列表
 */
const pathMaps = getPathMaps();
let HtmlWebpackPluginMap = [];

if (isDev) {
  let template = pathMaps.template;
  for (let key in template) {
    if (template.hasOwnProperty(key)) {
      let value = template[key];
      let HtmlWebpackPluginConfig;
      if (value.template) {
        HtmlWebpackPluginConfig = {
          filename: value.name,
          template: value.template,
          inject: 'body',
          chunks: [key]
        };
      }
      HtmlWebpackPluginMap.push(new HtmlWebpackPlugin(HtmlWebpackPluginConfig));
    }
  }
}

const pathMapsEntry = pathMaps.entry;
if (Object.keys(pathMapsEntry).length === 0) {
  console.log(`\n>>> 请确认${process.env.PAGE_DIR}路径是否正确 \n`);
  process.exit();
}

/* -----------------------
  公共配置
 ------------------------- */

let config = {
  entry: pathMapsEntry,
  output: {
    path: path.join(cwd, 'build'),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx'],
    alias: {
      components: path.join(cwd, 'src/components'),
      pages: path.join(cwd, 'src/pages'),
      styles: path.join(cwd, 'src/styles'),
      utils: path.join(cwd, 'src/utils'),
      widget: path.join(cwd, 'src/widget'),
      common: path.join(cwd, 'src/common'),
      'react-hot-loader': require.resolve('react-hot-loader')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          cacheDirectory: true,
          plugins: [
            require.resolve('babel-plugin-transform-decorators-legacy'),
            require.resolve('react-hot-loader/babel')
          ],
          presets: [require.resolve('babel-preset-cqaso-kit')]
        }
      },
      {
        test: /\.css$/,
        use: [

          { loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              sourceMap: isDev
            }
          }, {
            loader: require.resolve('postcss-loader'),
            options: {
              config: {
                path: path.join(__dirname, 'postcss.config.js'),
              }
            }
          }
        ]
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  mode: isDev ? 'development' : 'production',

  optimization: {
    noEmitOnErrors: true,
    concatenateModules: true
  },

  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: cwd,
      verbose: false
    }),
    ...HtmlWebpackPluginMap,

    // 进度插件
    new webpack.ProgressPlugin((percentage, msg) => {
      if (process.stdout.isTTY && isDev && percentage < 1) {
        process.stdout.cursorTo(0);
        process.stdout.write(
          chalk.yellow(`${(percentage * 100).toFixed(0)}% ${msg}`)
        );
        process.stdout.clearLine(1);
      } else if (percentage === 1) {
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
      }
    })
  ]
};

/* -----------------------
  开发配置
 ------------------------- */

if (isDev) {
  config.devtool = 'cheap-module-eval-source-map';

  config.optimization.namedModules = true;

  config.plugins.unshift(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  );

  config.watch = true;

  config.watchOptions = {
    aggregateTimeout: 500,
    poll: 1000,
    ignored: /node_modules/
  };
} else {
  /* -----------------------
  生产配置
 ------------------------- */
  console.log(`\n### 当前正在执行${'生产环境'.red}的构建。\n`);
  // config.devtool = 'source-map'
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
}

module.exports = config;
