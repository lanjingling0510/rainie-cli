/*
 * @desc
 * @author: rainie(chenyutian0510@gmail.com)
 * @since: 08/07/2018
 *
 *
 * 发布
 *
 *  通用模块发布会有两个阶段:
 *
 *  检查阶段:
 *  test: 执行 test 测试用例
 *  npm: 执行 npm 配置检查
 *  发布阶段:
 *  git: 包含升级版本, 生成 changelog, 提交代码, 推送 commits 与 tags
 *  npm: 包含登录 npm/tnpm, 发布至 npm/tnpm
 *
 *  检查阶段:
 *  test: rnc test
 *  npm: ensure npm registry
 *
 *  发布阶段:
 *  npm: update version
 *  git: edit changelog
 *  git: commit
 *  git: create release branch,  merge master
 *  git: add tag
 *  git: remote push
 *  npm: publish （prepublishOnly npm run build)
 */

import chalk from 'chalk';
import EventEmitter from 'events';
import upload from '@rnc/plugin-oss-upload';
import sequence from '@rnc/plugin-sequence';
import find from '@rnc/plugin-find';
import spinner from '@rnc/spinner';
import shell from '@rnc/shell';
import path from 'path';

const error = chalk.red;


async function publish(pagePath, cmd) {
  const reporter = new EventEmitter();
  const srcPath = pagePath.length > 0 ? pagePath : '**';
  const config = this.config;

  try {

    /**
     * 监听消息事件
     */
    reporter.on('message', (name, data) => {
      if (name === 'oss-upload' && data.type === 'log') {
        if (data.key === 'succeed') {
          spinner.succeed(data.msg);
        } else if (data.key === 'fail') {
          spinner.fail(data.msg);
        } else {
          console.log(data.msg);
        }
      }
    });

    sequence(
      find(srcPath, {
        expandDirectories: true,
        onlyFiles: true,
        cwd: path.join(config.buildContext, 'pages')
      }),
      upload({
        cwd: config.buildContext,
        baseUrl: path.join(this.projectConfig.name, this.projectConfig.version),
        force: true,
      })
    )({reporter});

  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default publish;
