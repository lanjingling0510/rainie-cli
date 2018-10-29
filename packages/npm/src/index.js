
import chalk from 'chalk';
import shell from '@rnc/shell';
import axios from 'axios';

const DEST_REGISTRY = 'https://registry.npmjs.org';

/**
 * 检测npm代理
 */
export async function ensureRegistry(url) {
  const registry = await shell.exec('npm config get registry');
  console.log(chalk.yellow(`当前npm代理:${registry}`));

  const destRegistry = url || DEST_REGISTRY;
  if (registry !== 'https://registry.npmjs.org/') {
    console.log(chalk.yellow(`切换到npm代理:${destRegistry}`));
    await shell.exec(`npm config set registry ${destRegistry}`);
  }
}



  /**
   * 获取 npm 包的信息 (从远程获取)
   *
   * @param {String} name
   * @param {String} depVersion
   * @return {Promise}
   */
export async function getInfo (name, depVersion) {
  if (!depVersion) {
    depVersion = 'latest'
  }

  const url = `${DEST_REGISTRY}/${name}`;

  return axios.get(url)
    .then(resp => {
      let parsed = resp.data;
      if (!parsed.error) {
        return parsed;
      }

      return false
    })
}

export default {
  ensureRegistry,
  getInfo,
};








