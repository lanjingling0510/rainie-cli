import plugin from '@rnc/plugin-core';


export default (glob, userOptions = {}) =>
  plugin('find', async ({ logFile }) => {
    const globby = require('globby');
    const options = {
      ignore: ['node_modules/**'],
      ...userOptions,
      deep: true,
      onlyFiles: false,
      expandDirectories: false,
      absolute: true
    }
    const result = await globby(glob, options)
    result.forEach(logFile)

    return {
      files: result.map((file) => ({
        path: file,
        data: null,
        map: null
      }))
    }
  });
