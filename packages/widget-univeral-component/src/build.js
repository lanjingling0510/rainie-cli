
import _build from './_build';
import chalk from 'chalk';

/**
 * 打包命令
 * @param {Object} params 命令参数数组
 * @param {Object} cmd 命令对象
 * @param {Object} config 配置文件
 */
async function build(params, cmd, config) {
    process.env.NODE_ENV = 'production';
    console.log(`\n${chalk.cyan('###')} 当前正在执行${chalk.red('生产环境')}的构建。\n`);
  return _build(params, cmd, config);
}

export default build;

