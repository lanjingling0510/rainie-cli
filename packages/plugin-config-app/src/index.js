import plugin from '@rnc/plugin-core';

export default projectConfig =>
  plugin('type-app', async () => {
    const config = require('./config');
    return {
      defaultConfig: config(projectConfig)
    };
  });
