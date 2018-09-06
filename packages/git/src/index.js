
import chalk from 'chalk';
import fse from 'fs-extra';
import utils from '@rnc/utils';
import shell from '@rnc/shell';


/**
 * 根据part升级版本
 */
export function updateVersion(semverVersion, part){
  const partChoices = ['major', 'feature', 'patch'];
  let semverArray = semverVersion.split('.').map(function(val){
      return +val;
  });
  let increasePosition = partChoices.indexOf(part);
  semverArray[increasePosition]++;

  for(let i = increasePosition + 1; i < semverArray.length; i++){
      semverArray[i] = 0;
  }

  return semverArray.join('.');
}


/**
 * 获得当前版本
 * 读取 packge.json 文件，获取当前版本信息
 */
export function getCurentVersion() {
  let path = process.cwd() +  '/package.json';
  let stats = fse.statSync(path);
  if(stats.isFile()){
      let packageInfo = JSON.parse(fse.readFileSync(path));
      return packageInfo.version;
  }

  console.log(chalk.red('找不到package.json文件'));
  process.exit(1);
}

/**
 * 修改package版本
 */
export async function updatePackageVersion(version) {
  // 检查当前分支状态
  const hasModify = await shell.exec('git status --porcelain');
  if (hasModify) {
    console.log(chalk.red('请先提交代码'));
    process.exit(1);
  }

  console.log(chalk.yellow('>>> 升级package文件...'));
  const packageDir = process.cwd() +  '/package.json';
  const isExist = await fse.exists(packageDir);
  if (!isExist) {
    console.log(chalk.red('找不到package.json文件'));
    process.exit(1);
  }

  const pkg = await fse.readJson(packageDir);
  pkg.version = version;
  return fse.writeJSON(packageDir, pkg, {spaces: 2});
}


/**
 * 获得下一个版本
 */
export async function getNextVersion() {
  const currentVersion = getCurentVersion();
  const versionNextSuggest = {
    major: updateVersion(currentVersion, 'major'),
    feature: updateVersion(currentVersion, 'feature'),
    patch: updateVersion(currentVersion, 'patch'),
  };

  const choices = [{
      short: versionNextSuggest.patch,
      name: 'patch   (' + versionNextSuggest.patch + ')\n' +
        chalk.gray('  - 递增修订版本号(用于 bug 修复)'),
      value: versionNextSuggest.patch
  }, {
      short: versionNextSuggest.feature,
      name: 'feature (' + versionNextSuggest.feature + ')\n' +
        chalk.gray('  - 递增特性版本号(用于向下兼容的特性新增, 递增位的右侧位需要清零)'),
      value: versionNextSuggest.feature
  }, {
      short: versionNextSuggest.major,
      name: 'major   (' + versionNextSuggest.major + ')\n' +
        chalk.gray('  - 递增主版本号  (用于断代更新或大版本发布，递增位的右侧位需要清零)'),
      value: versionNextSuggest.major
  }];


  const nextVersion = await utils.list('更新版本号:', choices);
  return nextVersion;
}


/**
 * 发布当前分支
 */
export async function releaseCurrentBranch(version) {

  // 检查当前分支状态
  const hasModify = await shell.exec('git status --porcelain');
  if (hasModify) {
    console.log(chalk.red('请先提交代码'));
    process.exit(1);
  }

  // 创建release分支
  console.log(chalk.yellow('>>> 开始针对当前分支进行发布...'));
  const branches = await shell.exec('git branch');
  const currBranch = await shell.exec('git rev-parse --abbrev-ref HEAD');
  console.log(currBranch);
  if (currBranch.trim() !== `release/${version}`) {
    if (branches.indexOf(`release/${version}`) !== -1) {
      await shell.exec(`git branch -d release/${version}`)
    }
    await shell.exec(`git checkout -b release/${version}`)
  }

  await shell.exec(`git push origin release/${version}`);

  // 创建并发布tag
  await shell.series([
    `git tag publish/${version} && git push origin publish/${version}`,
    `git checkout master`,
    `git merge release/${version}`,
    `git config push.default current`,
    `git push`,
    `git checkout ${currBranch}`
  ])

  console.log(chalk.green('✔ 发布当前分支成功'));
}


/**
 * git提交
 */
export async function commit(msg) {
  return shell.series([
    'git add . ',
    `git commit -m '${msg}'`
  ]);
}

/**
 * git推送
 */
export async function push() {
  return shell.series([
    'git config push.default current',
    'git push'
  ]);
}















