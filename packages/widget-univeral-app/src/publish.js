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
import sequence from '@rnc/plugin-sequence';
import {getNextVersion} from '@rnc/git';
import {gitCommit, gitPush, updatePackageVersion, releaseCurrentBranch} from '@rnc/plugin-git';
import shell from '@rnc/shell';

const error = chalk.red;


async function publish(pagePath, cmd) {

  try {


    const nextVersion = await getNextVersion();

    sequence(
      updatePackageVersion(nextVersion),
      gitCommit(`chore(package.json): update version to ${nextVersion} by rnc`),
      gitPush(),
      releaseCurrentBranch(nextVersion),
      // ensureNpmRegistry(),
      // npm('run publish'),
      // find(srcPath, {
      //   expandDirectories: true,
      //   cwd: path.join(config.buildContext, 'pages')
      // }),
      // upload({
      //   cwd: config.buildContext,
      //   force: true,
      // })
    )();

  } catch (err) {
    console.log(error(err));
    shell.exit(1);
  }
}

export default publish;
