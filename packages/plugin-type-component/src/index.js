import plugin from '@rnc/plugin-core';

export default plugin('type-component', async () => {
  const config =
    process.env.NODE_ENV === 'development'
      ? require('./config.dev.js')
      : require('./config.build.js');

  return {
    defaultConfig: config
  };
});
