import plugin from '@rnc/plugin-core';


export default mesage =>
  plugin('select', async ({ files, logFile, ...other }) => {
    const {default: utils} = require('@rnc/utils');
    const fs = require('fs-extra');
    const path = require('path');

    const filePromises = files.map(async file => {
      if (file.type === 'file') {
        return file;
      } else if (file.type === 'directory') {
        const packageDir = path.join(file.path, 'package.json');

        if (await fs.exists(packageDir)) {
          const pkg = await fs.readJson(packageDir);
          return {
            ...file,
            name: '📚:' + pkg.description
          };
        } else {
          return file;
        }
      }
    });

    const normalFiles = await Promise.all(filePromises);
    const choises = normalFiles.map(file => ({ ...file, value: file.path }));
    const selectPath = await utils.list(mesage, choises);
    const choiseFile = normalFiles.find(file => file.path === selectPath);
    logFile(choiseFile);

    return {
      files: [choiseFile],
    };
  });
