
import nodeExternals from 'webpack-node-externals';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import webpack from 'webpack';
import path from 'path';


const isDev = process.env.NODE_ENV === 'development';
const pageContext = process.env.PAGE_CONTEXT;
const buildContext = process.env.BUILD_CONTEXT;

/**
 * 设置HtmlWebpackPlugin列表
 */
const pathMapsEntry = {
  main: path.join(pageContext, 'index.js')
}


/* -----------------------
  公共配置
 ------------------------- */

let config = {
  entry: pathMapsEntry,

  target: 'node',

  mode: isDev ? 'development' : 'production',

  devtool: 'source-map',

  output: {
    path: buildContext,
    publicPath: '',
    libraryTarget: 'commonjs2',
    filename: '[name].js',
  },

	resolve: {
    extensions: [
      '.json', '.js',
    ],
  },

  node: {
    __dirname: true,
    __filename: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  externals: [nodeExternals({})],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          plugins: [
            [require.resolve('@babel/plugin-proposal-object-rest-spread'), { 'useBuiltIns': true }],
            require.resolve('@babel/plugin-transform-runtime'),
            require.resolve('@babel/plugin-proposal-class-properties'),
          ],
          presets: [
            [require.resolve('@babel/preset-env'), {targets: {node: 'current'}, modules: false}]
          ],
        }
      },
    ]
  },

  optimization: {
    noEmitOnErrors: true,
  },

  plugins: [

    new webpack.BannerPlugin({
      raw: true,
      entryOnly: false,
      banner: `require('${
        // Is source-map-support installed as project dependency, or linked?
        require.resolve('source-map-support').indexOf(process.cwd()) === 0
          ? // If it's resolvable from the project root, it's a project dependency.
            'source-map-support/register'
          : // It's not under the project, it's linked via lerna.
            require.resolve('source-map-support/register')
      }')`,
    }),

    new FriendlyErrorsWebpackPlugin({
      clearConsole: isDev,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? JSON.stringify('development') : JSON.stringify('production')
      }
    })
  ]
};


module.exports = config;
