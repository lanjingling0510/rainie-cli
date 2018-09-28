import plugin from '@rnc/plugin-core';


export default (options) =>
  plugin('oss-upload', async ({ files, logMessage }) => {
    const {default:OssClient} = require('@rnc/oss');
    const path = require('path');
    const oss = new OssClient(options);

    logMessage({
      type: 'log',
      msg: '上传asset到oss:'
    });

    const copyPromises = files.map(async file => {
      const object = path.relative(options.cwd, file.path);
      const destPath = path.join(options.baseUrl, object);

      const result = await oss.upload(destPath, file.path, options.force);
      if (result) {
        logMessage({
          type: 'log',
          key: 'succeed',
          msg: `上传————${destPath}`
        });
      } else {
        logMessage({
          type: 'log',
          key: 'fail',
          msg: `上传————${destPath}`
        });
      }
    });

    await Promise.all(copyPromises);

    logMessage({
      type: 'log',
      key: 'succeed',
      msg: '上传oss完成'
    });

  });
