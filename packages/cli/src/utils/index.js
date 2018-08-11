import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

/**
 * 检测模块是否存在
 * @param {string} module 模块路径
 */
export function checkModule(module) {
  try {
    require.resolve(module)
  } catch (e) {
    console.error(chalk.red('模块不存在: %s'), module);
    process.exit(1);
  }
}


/**
 *获取rainie配置
 */
export function getRainieConfig(configPath) {
  const {default: rainieConfig} = require('../config/rainie.config');
  // 配置文件如果存在则读取
  if(fs.existsSync(path.resolve(configPath))){
      const config = require(path.resolve(configPath));
      const env = process.env.NODE_ENV;
      return Object.assign({}, rainieConfig, config, config.env && config.env[env]);
  }

  return rainieConfig;
}


/**
 * 获得相对于ci根目录的路径
 * @param {string} absolutePath 相对于ci根目录
 */
export function getRootPath(absolutePath) {
  const scPath = path.join(__dirname, '../..', absolutePath);
  if (fs.existsSync(scPath)) {
    return scPath;
  } else {
    console.log(chalk.red('找不到相对于ci根目录的文件:' + absolutePath));
    process.exit(1);
  }
}
