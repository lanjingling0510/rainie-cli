/*
 * @desc 插件生成器
 * @author: wb-cyt420097 (wb-cyt420097@alibaba-inc.com)
 * @since: 25/07/2018
 *
 * 提供创造插件的包装方法
 * (config) => (name, asyn pluginFn) => asyn function (input) => promise (output);
 */

import EventEmitter from 'events';

export const StartFile = {
  name: '',
  path: '',
  data: null,
};

export const StartPluginPropsBefore = {
  files: [StartFile],
  reporter: new EventEmitter(),
  logFile: file => void 0,
  logMessage: message => void 0
};

export default (name, pluginFn) => async ({
  reporter,
  ...rest
} = StartPluginPropsBefore) => {
  try {

    reporter.emit('start', name);

    const result = await pluginFn({
      ...rest,
      reporter,
      logFile: file => reporter.emit('file', name, file),
      logMessage: message => reporter.emit('message', name, message)
    });

    reporter.emit('done', name);

    return {
      reporter,
      ...rest,
      ...result
    };
  } catch (error) {
    console.log(error);
    reporter.emit('error', name, error);
    throw null;
  }
};
