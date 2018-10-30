import chalk from 'chalk';
import shell from 'shelljs';
import logger from '@rnc/logger';
import spawn from 'cross-spawn';
import readline from 'readline';


/**
 * 执行命令
 * NOTE: 使用spawn可以通过 stream 的方式操作子进程的输出
 * @param {string} cmd 命令
 * @param {object} options 配置
 * @param {stream} writeStream 写流
 * @returns
 */
function exec(cmd, options, writeStream) {
  logger.log(chalk.cyan('run command >>>: ') + chalk.bgBlackBright.bold(cmd));
  return new Promise((resolve, reject) => {
    const bin = cmd.split(/\s+/)[0];
    const args = cmd.split(/\s+/).slice(1);
    const child = spawn(bin, args, { stdio: 'pipe', ...options });

    child.on('close', (code, stdout, stderr) => {
      if (code) {
        reject(stdout || stderr);
      } else {
        logger.success((chalk.bold(chalk.underline(cmd) + ' —— 执行成功')));
        resolve(stdout || stderr);
      }
    });

    if (writeStream) {
      child.stdout.pipe(writeStream);
      child.stderr.pipe(writeStream);
    }

    child.stderr.on('data', (data) => {
      logger.warning(chalk.bold(data));
    });

    // 式操作子进程的输出, 打印，收集数据
    child.stdout.on('data', (data) => {
      // 使用readline模块，解决不是tty情况下process.stdout.cursorTo不存在
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('\u001B[90m' + data.toString('utf8') + '\u001B[22m\u001B[39m');
      // process.stdout.clearLine();
      // process.stdout.cursorTo(0);
    });
  });
}

/**
 * 批量执行命令
 */
async function series(cmds, options, writeStream) {
  for (const cmd of cmds) {
    await exec(cmd, options, writeStream);
  }
}

export default {
  ...shell,
  exec,
  series,
};
