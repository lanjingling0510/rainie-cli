import path from 'path';
import babel from 'rollup-plugin-babel';

const buildContext = process.env.BUILD_CONTEXT;

const config = {
  input: path.resolve('src', 'index.js'),

  external: id => /@babel\/runtime-corejs2|react/.test(id),

  plugins: [
    babel({
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            modules: false,
            loose: true,
            targets: {
              browsers: ['last 2 versions', 'not ie <= 8']
            }
          }
        ],
        [require.resolve('@babel/preset-react'), {development: false}],
      ],
      exclude: ['node_modules/**'],
      plugins: [
        [require.resolve('@babel/plugin-transform-runtime'), {
          "helpers": true,
          "corejs": 2,
          "regenerator": true,
          "useESModules": true,
        }],
        [require.resolve("@babel/plugin-proposal-class-properties"), { "loose": false }],
        [require.resolve('@babel/plugin-proposal-decorators'), { "legacy": true }],
      ],
      externalHelpers: true,
      runtimeHelpers: true,
      babelrc: false
    })
  ],

  output: {
    format: 'es',
    dir: buildContext
  }
};

module.exports = config;
