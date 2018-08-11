import plugin from '@rnc/plugin-core';

export default rollupConfig =>
  plugin('compiler-rolllup', async ({ defaultConfig }) => {
    const chalk = require('chalk');
    const rollup = require('rollup');
    const webpackMerge = require('webpack-merge');

    const isDev = process.env.NODE_ENV === 'development';

    rollupConfig = webpackMerge(defaultConfig, rollupConfig);

    async function setupBuildCompiler(config) {
      await rollup.rollup(config).then(bundle => {
        bundle.write({
          ...config.output
        });
      });

      console.log(chalk.green('✔ 构建成功'));
    }

    // 运行程序
    if (isDev) {
      // 暂时没有开发环境用rollup
    } else {
      await setupBuildCompiler(rollupConfig);
    }
  });
