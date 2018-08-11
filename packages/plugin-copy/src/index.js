import plugin from '@rnc/plugin-core';

const defaultOptions = {
  // 是否询问覆盖
  enquireCover: true,
  // TODO:
  excludes: ['node_modules'],
};


const isRegexp = regx => Object.prototype.toString.apply(regx) === '[object RegExp]';


export default (outDirRelative, options = defaultOptions) =>
  plugin('copy', async ({ files, logMessage }) => {
    const {default: utils} = require('@rnc/utils');
    const {default: shell} = require('@rnc/shell');
    const fs = require('fs-extra');
    const path = require('path');

    await fs.ensureDir(outDirRelative);
    // 检查指定目录是否可以覆盖文件
    if (options.enquireCover && await utils.canCoverDir(outDirRelative)) {
      //  清空目录文件
      shell.rm('-rf', outDirRelative + '/*', outDirRelative + '/.*');
    }

    // 拉取模板
    logMessage({
      type: 'spinner',
      key: 'start'
    });

    const filterFunc = src => {
      return options.excludes.every(exclude => {
        if (isRegexp(exclude)) {
          return !exclude.test(src);
        }

        else {
          return path.basename(src) !== exclude;
        }
      });
    }

    const copyPromises = files.map(async file => {
      await fs.copy(file.path, outDirRelative, { filter: filterFunc });
    });

    await Promise.all(copyPromises);

    logMessage({
      type: 'spinner',
      key: 'succeed'
    });

  });
