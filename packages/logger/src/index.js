import chalk from 'chalk';
import logSymbols from 'log-symbols';

const logTypeConfig = {
  error: {
    color: 'red',
    header: `${logSymbols.error} - `
  },
  success: {
    color: 'green',
    header: `${logSymbols.success} - `
  },
  warning: {
    color: 'yellow',
    header: `${logSymbols.warning} - `
  },
  info: {
    color: 'cyan',
    header: `${logSymbols.info} - `
  },
  env: {
    color: 'magenta',
    header: `[ENV] - `
  },
  log: {
    color: 'reset',
    header: ''
  }
};

const logger = {
  _log(msg, options = {}) {
    options = Object.assign({}, logger.defaultOptions, options);
    const config = logTypeConfig[options.type];
    const header =
      typeof options.customHeader === 'undefined'
        ? config.header
        : options.customHeader;
    msg = header + msg;

    if (options.emitEnable) {
      this.emit(`message:${options.type}`, msg);
      this.emit('message', msg);
    }

    console.log(chalk[config.color](msg));
  },

  on(key, listener) {
    if (!this._events) {
      this._events = {};
    }
    if (!this._events[key]) {
      this._events[key] = [];
    }
    if (
      !this._events[key].indexOf(listener) !== -1 &&
      typeof listener === 'function'
    ) {
      this._events[key].push(listener);
    }
    return this;
  },

  emit(key) {
    let args = Array.prototype.slice.call(arguments, 1) || [];
    if (!this._events || !this._events[key]) {
      return;
    }
    let listeners = this._events[key];
    let i = 0;
    let l = listeners.length;
    for (i; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return this;
  }
};

logger.defaultOptions = {
  // 类型
  type: 'log',
  // 是否发射事件
  emitEnable: false,
  // 是否有消息头
  hasHeader: true,
  // 自定义消息头
  customHeader: undefined
};

Object.keys(logTypeConfig).reduce((obj, key) => {
  logger[key] = function(msg, options) {
    logger._log.apply(logger, [msg, { ...options, type: key }]);
  };

  return logger;
}, logger);

export default logger;
