import chalk from 'chalk';
import shell from 'shelljs';
import logger from '@rnc/logger';
import spawn from 'cross-spawn';



const normalizewriteStream = (stream) => {
  if (!stream) {
    stream = {write: () => {}};
  }

  return stream;
}

/**
 * 执行命令
 * NOTE: 使用spawn可以通过 stream 的方式操作子进程的输出
 * @param {string} cmd 命令
 * @param {object} options 配置
 * @param {stream} writeStream 写流
 * @returns
 */
function exec(cmd, options, writeStream) {
  writeStream = normalizewriteStream(writeStream);

  const startMsg = chalk.cyan('run command >>>: ') + chalk.bgBlackBright.bold(cmd);
  const logMsg = logger.log(startMsg);
  writeStream.write(logMsg);


  return new Promise((resolve, reject) => {
    const bin = cmd.split(/\s+/)[0];
    const args = cmd.split(/\s+/).slice(1);
    const child = spawn(bin, args, { stdio: 'pipe', ...options });

    child.on('close', (code, stdout, stderr) => {
      if (code) {
        reject(stdout || stderr);
      } else {
        const successMsg = logger.success(chalk.underline(cmd) + ' —— 执行成功');
        writeStream.write(successMsg);
        resolve(stdout || stderr);
      }
    });

    child.stderr.on('data', (data) => {
      logger.once('message:warning', msg => {
        writeStream.write(msg);
      });
      logger.warning(data.toString('utf8'));
    });

    // 式操作子进程的输出, 打印，收集数据
    child.stdout.on('data', (data) => {
      logger.once('message:content', msg => {
        writeStream.write(msg);
      });
      logger.content(data.toString('utf8'));

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
