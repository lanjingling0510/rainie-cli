import plugin from '@rnc/plugin-core';


export default (npmClient, cmd, options = {}) =>
  plugin('npm', async () => {
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
    await shell.exec(command, options);
  });


  /**
   * 确保正确的代理
   * @param {string} url [代理地址]
   */
  export const ensureNpmRegistry = (url) =>
    plugin('ensureNpmRegistry', async () => {
        const {ensureRegistry} = require('@rnc/npm');
        await ensureRegistry(url);
    });
