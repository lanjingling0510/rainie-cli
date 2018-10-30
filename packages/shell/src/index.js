import chalk from 'chalk';
import shell from 'shelljs';
import logger from '@rnc/logger';
import spawn from 'cross-spawn';

/**
 * 执行命令
 * NOTE: 使用spawn可以通过 stream 的方式操作子进程的输出
 */
function exec(cmd, options) {

  logger.log(chalk.cyan('run command >>>: ') + chalk.bgBlackBright.bold(cmd));
  return new Promise((resolve, reject) => {
    const bin = cmd.split(/\s+/)[0];
    const args = cmd.split(/\s+/).slice(1);
    const child = spawn(bin, args, { stdio: 'pipe', ...options });

    child.on('close', (code, stdout, stderr) => {
      if (code) {
        logger.error(chalk.bold(stdout || stderr));
        reject(stdout || stderr);
      } else {
        logger.success((chalk.bold(chalk.underline(cmd) + ' —— 执行成功')));
        resolve(stdout || stderr);
      }
    });

    // 式操作子进程的输出
    child.stdout.on('data', (data) => {
      // 打印，收集数据
      process.stdout.write('\u001B[90mf' + data.toString('utf8') + '\u001B[22m\u001B[39m');
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    });
  });
}

/**
 * 批量执行命令
 */
async function series(cmds, options) {
  for (const cmd of cmds) {
    await exec(cmd, options);
  }
}

export default {
  ...shell,
  exec,
  series,
};
