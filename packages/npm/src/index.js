
import chalk from 'chalk';
import shell from '@rnc/shell';

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














