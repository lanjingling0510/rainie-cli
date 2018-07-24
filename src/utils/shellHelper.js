import chalk from 'chalk';
import shell from 'shelljs';

/**
 * execute a single shell command where "cmd" is a string
 */
function exec(cmd) {
  // this would be way easier on a shell/bash script :P
  var child_process = require('child_process');

  var parts = cmd.split(/\s+/g);

  var p = child_process.spawn(parts[0], parts.slice(1), { stdio: 'ignore' });

  return new Promise((resolve, reject) => {
    p.on('exit', function(code) {
      var err = null;
      if (code) {
        err = new Error(
          'command "' + cmd + '" exited with wrong status code "' + code + '"'
        );
        err.code = code;
        err.cmd = cmd;
        reject(err);
      }

      resolve(code);
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
      shell.exec(cmd, function(err) {
        if (err) {
          reject(err);
        } else {
          if (cmds.length) {
            execNext();
          } else {
            resolve(null);
          }
        }
      });
    };
    execNext();
  });
}

export default {
  exec,
  series
};
