import plugin from '@rnc/plugin-core';


export default () =>
  plugin('lintStaged', async () => {
    const {default: shell} = require('@rnc/shell');
    await shell.exec('lint-staged');
  });
