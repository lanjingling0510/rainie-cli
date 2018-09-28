
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
  const config = this.config;
  const reporter = new EventEmitter();
  const srcPath = pagePath.length > 0 ? pagePath : '**';

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
        cwd: path.join(config.buildContext)
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
