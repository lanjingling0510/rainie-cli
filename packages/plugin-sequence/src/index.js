import plugin from '@rnc/plugin-core';

export default (...plugins) =>
  plugin('sequence', props =>
    plugins.reduce(async (prev, next) => {
      const nextPlugin = await next;
      const prevResult = await prev;

      return nextPlugin(prevResult);
    }, Promise.resolve(props))
  );


