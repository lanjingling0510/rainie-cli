

import inquirer from 'inquirer';
import FallbackPort from 'fallback-port';
import fs from 'fs';
import chalk from 'chalk';
import _print from './print';
import _net from './net';
import _file from './file';


export const print = _print;
export const net = _net;
export const file = _file;

export function isNil(value) {
  return null == value;
}

export function isEmpty(value) {
  if (value === undefined || String(value).trim() === '' || value === null) {
    return true;
  }

 return false;
}

export async function confirm(message, defaultValue) {
  const promptMessage = chalk.blue('>>>') + ': ';
  const schema = [
    {
      type: 'confirm',
      name: 'confirm',
      message: promptMessage + message,
      default: defaultValue
    }
  ];

  const result = await inquirer.prompt(schema);
  return result.confirm;
}

export async function input(message, defaultValue) {
  const promptMessage = chalk.blue('>>>') + ': ';
  const schema = [
    {
      type: 'input',
      name: 'message',
      message: promptMessage + message,
      default: defaultValue
    }
  ];

  const result = await inquirer.prompt(schema);
  return result.message;
}

export async function list(message, choices) {
  const promptMessage = chalk.blue('>>>') + ': ';
  const schema = [
    {
      type: 'list',
      name: 'value',
      message: promptMessage + message,
      choices: choices
    }
  ];

  const result = await inquirer.prompt(schema);
  return result.value;
}


/**
 * 检查指定目录是否可以覆盖模板
 * @param {String} dir 目录
 * @return {Boolean}
 */
export async function canCoverDir(dir) {
  // 除了 .git 之外
  let files = fs.readdirSync(dir).filter(file => {
    return file !== '.git';
  });

  if (files.length) {
    console.log(chalk.yellow('[i] 当前目录 %s 下存在以下文件:\n'), dir);
    files.forEach(file => console.log(' - ' + file));
    console.log();

    return await confirm(`你确定要覆目录吗?`, true);
  }

  return true;
}


/**
 * 获取一个可用的端口号
 * @param  {integer} configPort 默认端口号
 * @return {integer} 可用端口号
 */
export function getAvailablePort(configPort) {
  const fallbackPort = new FallbackPort(configPort);
  const port = fallbackPort.getPort();
  if (port !== configPort) {
    console.log(
      chalk.yellow(
        `${configPort} 端口已被占用, 开启另外一个端口: ${port}, 防止冲突!\n\n`
      )
    );
  }
  return port;
}

export default {
  isNil,
  isEmpty,
  confirm,
  input,
  list,
  canCoverDir,
  getAvailablePort,
  print,
  net,
  file,
};

