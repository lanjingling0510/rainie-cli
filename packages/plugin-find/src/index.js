import plugin from '@rnc/plugin-core';


export default (glob, userOptions = {}) =>
  plugin('find', async ({ logFile }) => {
    const globby = require('globby');
    const path = require('path');
    const fs = require('fs');
    const dirGlob = require('./dir-glob');

    const options = {
      ignore: ['node_modules/**'],
      deep: true,
      onlyFiles: false,
      expandDirectories: false,
      absolute: true,
      ...userOptions,
    };

    // NOTE: globby expandDirectories depend on dir-glob, but expandDirectories has issue
    // https://github.com/kevva/dir-glob/issues/7
    if (options.expandDirectories) {
      glob = await dirGlob(glob, options);
    }

    const result = await globby(glob, options);

    result.forEach(logFile);

    const files = [];

    result.map(file => {
      const fsStats = fs.statSync(file);
      if(fsStats.isFile()){
        files.push({
          type: 'file',
          name: path.basename(file),
          path: file,
          data: null
        });
      }else if(fsStats.isDirectory()){
        files.push({
          type: 'directory',
          name: path.basename(file),
          path: file,
          data: null
        });
      }
    });

    return {
      files: files
    };
  });
