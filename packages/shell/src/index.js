import chalk from 'chalk';
import shell from 'shelljs';

/**
 * execute a single shell command where "cmd" is a string
 */
function exec(cmd) {
  // this would be way easier on a shell/bash script :P
  console.log(chalk.cyan('run command: ') + chalk.magenta(cmd));

  return new Promise((resolve, reject) => {
    shell.exec(cmd, {silent: true}, function(code, stdout, stderr) {
      if (stderr) {
        console.log(`${chalk.red(cmd + '执行失败')}`);
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * execute multiple commands in series
 * this could be replaced by any flow control lib
 */
function series(cmds) {
  return new Promise((resolve, reject) => {
    var execNext = function() {
      let cmd = cmds.shift();
      console.log(chalk.cyan('run command: ') + chalk.magenta(cmd));
      shell.exec(cmd, {silent: true}, function(code, stdout, stderr) {
        if (stderr) {
          console.log(`${chalk.red(cmd + '执行失败')}`);
          reject(stderr);
        } else {
          if (cmds.length) {
            execNext();
          } else {
            resolve(stdout);
          }
        }
      });
    };
    execNext();
  });
}

export default {
  ...shell,
  exec,
  series,
};
