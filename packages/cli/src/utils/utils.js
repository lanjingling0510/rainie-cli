import inquirer from 'inquirer';
// import FallbackPort from 'fallback-port';
import chalk from 'chalk';

export function isNil(value) {
  return null == value;
}

export function isEmpty(value) {
  if (isNil(value)) {
    return true;
  }

  value = String(value).trim();
  return value === '';
}

export async function confirm(message, defaultValue) {
  let schema = [
    {
      type: 'confirm',
      name: 'confirm',
      message: message,
      default: defaultValue
    }
  ];

  const result = await inquirer.prompt(schema);
  return result.confirm;
}

/**
 * 获取一个可用的端口号
 * @param  {integer} configPort 默认端口号
 * @return {integer} 可用端口号
 */
// function getAvailablePort(configPort) {
//   const fallbackPort = new FallbackPort(configPort);
//   const port = fallbackPort.getPort();
//   if (port !== configPort) {
//     console.log(
//       chalk.yellow(
//         `${configPort} 端口已被占用, 开启另外一个端口: ${port}, 防止冲突!\n\n`
//       )
//     );
//   }
//   return port;
// }

// export default {
//   isNil,
//   isEmpty,
//   confirm,
//   getAvailablePort
// };
