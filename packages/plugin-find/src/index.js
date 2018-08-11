import plugin from '@rnc/plugin-core';
import path from 'path';


export default (glob, userOptions = {}) =>
  plugin('find', async ({ logFile }) => {
    const globby = require('globby');
    const path = require('path');
    const fs = require('fs');

    const options = {
      ignore: ['node_modules/**'],
      ...userOptions,
      deep: true,
      onlyFiles: false,
      expandDirectories: false,
      absolute: true
    };

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
