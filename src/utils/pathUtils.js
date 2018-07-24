
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

export function getScaffoldPath(type, ...paths) {
  const scPath = path.join(__dirname, '../scaffolds', type, ...paths);
  if (fs.existsSync(scPath)) {
    return scPath;
  } else {
    console.log(chalk.red('找不到脚手架文件:' + paths.join('/')));
    process.exit(1);
  }
}
