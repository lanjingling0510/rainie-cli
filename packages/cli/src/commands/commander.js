import commander from 'commander';

class Commander {
  constructor (version, context) {
    this.program = commander;
    this.version = version;
    this.context = context;
    this.program.version(version, '-v, --version');
  }

  /**
   * 注册命令
   */
  register(config) {
    let cmd = this.program
      .command(config.name)
      .arguments(config.arguments);

    const options = config.options || [];

    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      cmd = cmd.option(option.flags, option.desc, option.default);
    }

    // NOTE: 在子spawn线程中执行rnc显示颜色
    cmd = cmd.option('--color', '显示终端颜色');

    cmd = cmd.description(config.desc);

    // 执行命令回调
    cmd.action(async (...args) => {
      await this.context.widgetMananger.execute(config.action, ...args);
    });
  }

  /**
   * 执行命令
   */
  async run() {
    this.program.parse(process.argv);
  }
}

export default Commander;
