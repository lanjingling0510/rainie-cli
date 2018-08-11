import plugin from '@rnc/plugin-core';

export default (npmClient, cmd, options = {}) =>
  plugin('npm', async () => {
    const { default: spinner } = require('@rnc/spinner');
    const {default: shell} = require('@rnc/shell');

    if (!shell.which(npmClient)) {
      shell.echo(`需要全局安装${npmClient}!`);
      shell.exit(1);
    }

    const cliArgs = Object.keys(options).reduce((result, key) => {
      const value = options[key];

      if (typeof value === 'boolean') {
        return result.concat(`--${key}`)
      }

      if (typeof value === 'string') {
        return result.concat(`--${key}`, `${value}`)
      }

      return result;
    }, []);

    const command = `${npmClient} ${cmd} ${cliArgs.join(' ')}`.trim();
    spinner.start(`执行命令:${command}`);
    await shell.exec(command);
    spinner.succeed(`执行命令: ${command} 成功`);
  });
