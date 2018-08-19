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
      const result = await oss.upload(object, file.path, options.force);
      if (result) {
        logMessage({
          type: 'log',
          key: 'succeed',
          msg: `上传————${object}`
        });
      } else {
        logMessage({
          type: 'log',
          key: 'fail',
          msg: `上传————${object}`
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
