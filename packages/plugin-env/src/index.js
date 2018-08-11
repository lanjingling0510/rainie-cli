import plugin from '@rnc/plugin-core';


export default (vars) =>
  plugin('env', async ({ logMessage }) => {
    Object.keys(vars).forEach((key) => {
      logMessage(`${key} = ${vars[key]}`)
      process.env[key] = vars[key]
    })
  });
