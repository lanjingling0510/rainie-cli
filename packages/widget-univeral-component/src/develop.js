
import build from './_build';
import chalk from 'chalk';

/**
 * 插件开发命令
 * @param {Object} params 命令参数数组
 * @param {Object} cmd 命令对象
 * @param {Object} config 配置文件
 */
async function develop(params, cmd) {
  console.log(`\n${chalk.cyan('###')} 当前正在执行${chalk.red('开发环境')}的构建。\n`);
  process.env.NODE_ENV = 'development';
  return build(params, cmd, this);
}

export default develop;

