import plugin from '@rnc/plugin-core';

export default (options, defaultConfig) =>
  plugin('type-app', async () => {
    const webpackMerge = require('webpack-merge');
    const configFactory = require('./config');
    return {
      config: webpackMerge(configFactory(options), defaultConfig)
    };
  });
