import plugin from '@rnc/plugin-core';


 export default plugin('type-app', async () => {
    const config = require('./config');
    return {
      defaultConfig: config,
    }
  });
