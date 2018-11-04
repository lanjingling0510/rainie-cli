import plugin from '@rnc/plugin-core';


export default (vars) =>
  plugin('env', async ({ logMessage }) => {
    Object.keys(vars).forEach((key) => {
      process.env[key] = process.env[key] || vars[key]
      logMessage(`${key} = ${process.env[key]}`)
    })
  });
