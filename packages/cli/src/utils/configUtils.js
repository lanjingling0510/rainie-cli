import path from 'path';
import fs from 'fs';
// import webpackMerge from 'webpack-merge';
import rainieConfig from '../config/rainie.config';


/**
 *获取rainie配置
 */
export function getRainieConfig(configPath) {
  // 配置文件如果存在则读取
  if(fs.existsSync(path.resolve(configPath))){
      const config = require(path.resolve(configPath));
      return Object.assign({}, rainieConfig, config);
  }

  return rainieConfig;
}


/**
 *获取脚手架配置
 */
// export function getScaffoldConfig(group, name, config = {}) {

//   const defaultConfig = require(path.join(__dirname, '../scaffolds', group, name, 'config.js'));

//   if (name === 'webpack') {
//     return webpackMerge(defaultConfig, config);
//   }

// }
