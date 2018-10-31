import chalk from 'chalk';
import logSymbols from 'log-symbols';
import {event} from '@rnc/utils';

const logTypeConfig = {
  error: {
    color: ['red', 'bold'],
    header: `${logSymbols.error} - `
  },
  success: {
    color: ['green'],
    header: `${logSymbols.success} - `
  },
  warning: {
    color: ['yellow', 'bold'],
    header: `${logSymbols.warning} - `
  },
  info: {
    color: ['cyan'],
    header: `${logSymbols.info} - `
  },
  env: {
    color: ['magenta'],
    header: `[ENV] - `
  },
  log: {
    color: ['reset'],
  },
  content: {
    color: ['dim'],
  }
};


const get = (from, selectors) =>
  selectors
  .replace(/\[([^\[\]]*)\]/g, '.$1.')
  .split('.')
  .filter(t => t !== '')
  .reduce((prev, cur) => prev && prev[cur], from);

const logger = {
  _log(msg, options = {}) {
    options = Object.assign({}, logger.defaultOptions, options);
    const config = logTypeConfig[options.type];
    const header =
      typeof options.customHeader === 'undefined'
        ? (config.header || '')
        : options.customHeader;
    const footer =
      typeof options.customFooter === 'undefined'
        ? (config.footer || '')
        : options.customFooter;

    const colorFn = get(chalk, config.color.join('.'));

    msg = colorFn(header + msg + footer);

    if (options.emitEnable) {
      this.emit(`message:${options.type}`, msg);
      this.emit('message', msg);
    }

    process.stdout.write(msg);
    return msg;
  },
};

logger.defaultOptions = {
  // 类型
  type: 'log',
  // 是否发射事件
  emitEnable: true,
  // 是否有消息头
  hasHeader: true,
  // 自定义消息头
  customHeader: undefined,
  // 自定义消息尾
  customFooter: undefined
};

event.mixTo(logger);

Object.keys(logTypeConfig).reduce((obj, key) => {
  logger[key] = function(msg, options) {
    logger._log.apply(logger, [msg, { ...options, type: key }]);
  };

  return logger;
}, logger);

export default logger;
