/*
 * @desc
 * @author: wb-cyt420097 (wb-cyt420097@alibaba-inc.com)
 * @since: 08/07/2018
 *
 *
 * 添加模板
 *
 * 1. 拉取github仓库的模板列表
 * 2. 选择模板
 * 3. 插入指定项目路径
 * 4. 安装npm依赖
 *
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';
import spinner from '../utils/spinner';
import shellHelper from '../utils/shellHelper';
import download from 'download-git-repo';
import inquirer from 'inquirer';
import { getRainieConfig } from '../utils/configUtils';
import utils from '../utils/utils';
import find from '@rnc/plugin-find';

const error = chalk.red;
const promptMessage = chalk.blue('>>>') + ': ';

/**
 *添加模板
 *
 * @param {*} tplName 模板名称
 * @param {*} tplPath 模板路径
 */
async function addp(cmd) {
  let schema, result;
  const config = getRainieConfig(cmd.config);

  try {
    // 选择模板
    schema = [
      {
        type: 'list',
        name: 'value',
        message: '选择模板：',
        choices: config.repositories.map(item => ({
          name: `${item.desc}(${
            item.owner === 'local'
              ? '本地'
              : '远程:' + item.owner + '/' + item.registry
          })`,
          value: item.owner + '/' + item.registry
        }))
      }
    ];

    result = await inquirer.prompt(schema);
    let repository = result.value;

    // 选择生成路径
    schema = [
      {
        type: 'input',
        name: 'message',
        message: promptMessage + '输入生成路径',
        default: '.'
      }
    ];

    result = await inquirer.prompt(schema);
    const destination = path.resolve(result.message);
    result = await find('./*')();
    process.exit(0);


    // 检查指定目录是否可以覆盖模板
    result = await checkDestPath(destination);

    if (result) {

      //  清空目录文件
      shell.rm('-rf', destination + '/*', destination + '/.*');

      // 拉取模板
      spinner.start('拉取模板...');

      // 本地模板
      if (/^local\/(.*)$/.test(repository)) {
        repository = RegExp.$1;
        shell.cp(
          '-Rf',
          path.join(__dirname, '../../_template', repository) + '/*',
          path.join(__dirname, '../../_template', repository) + '/.*',
          destination
        );
      }

      // 远程模板
      else {
        await downloadTemplate(repository, destination);
      }

      spinner.succeed('模板拉取成功');

      // 安装npm依赖
      spinner.start('安装依赖...');

      if (!shell.which('npm')) {
        shell.echo(error('需要全局安装npm!'));
        shell.exit(1);
      }

      await shellHelper.exec('npm install');
      spinner.succeed('依赖安装成功');

    }

    shell.exit(1);
  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

/**
 * 获取git仓库列表
 */
async function downloadTemplate(repository, destination) {
  return new Promise((resolve, reject) => {
    download(repository, destination, function(err) {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

/**
 * 检查指定目录是否可以覆盖模板
 * @param {String} dir 目录
 * @return {Boolean}
 */
async function checkDestPath(dir) {
  // 除了 .git 之外
  let files = fs.readdirSync(dir).filter(file => {
    return file !== '.git';
  });

  if (files.length) {
    console.log(chalk.yellow('[i] 当前目录 %s 下存在以下文件:\n'), dir);
    files.forEach(file => console.log(' - ' + file));
    console.log();

    return await utils.confirm(`你确定要在此目录覆盖模板吗?`, true);
  }

  return true;
}

export default addp;
