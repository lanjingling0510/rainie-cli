import plugin from '@rnc/plugin-core';


 export default plugin('node-server', async () => {
    const config = require('./config');
    return {
      defaultConfig: config,
    }
  });
