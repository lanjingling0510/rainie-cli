import globby from 'globby';
import path from 'path';

export function normalizeOptions(options) {
  options = Object.assign({}, options);

  options.feature = options.feature || {};

  // 通过环境变量指定入口
  if (process.env.PAGE_DIR) {
    options.pages = process.env.PAGE_DIR.split(',');
  }
  // 通过环境变量指定某个js文件进行编译
  else if (process.env.SPEC_ENTRY) {
    options.specifiedEntry = process.env.SPEC_ENTRY;
  }

  // 是否在dom上打源码标记
  if (process.env.ELEMENT_WRAPPER) {
    options.feature.wrapper = true;
  }

  // 是否打包模板
  if (process.env.BUILD_TEMPLATE || process.env.NODE_ENV === 'development') {
    options.buildTemplate = true;
  }

  options.nodeEnv = process.env.NODE_ENV;

  options.isDev = process.env.NODE_ENV === 'development';

  return options;
}


/**
 * 获取当前页面上下文目录的所有页面
 */
export function getAppPages(options) {
  return globby.sync('*', {
    cwd: options.pageContext
  }).map(item => ({
    name: item,
    file: path.join(options.pageContext, item)
  }))
}

/**
 * 获取入口
 */
export function getAppEntry(options) {
  const entry = {};
  const pageNames = options.pages;
  const appPages = getAppPages(options);

  // specified entry 目录相对于 page context.
  if (options.specifiedEntry) {
    // 格式化路径(去掉 "./"开头，或 ".jsx"结尾)
    const filename = options.specifiedEntry.replace(/(^\.\/|\.jsx?$)/g, '').replace('\\', '/');
    const key = 'pages/' + filename.replace(/\/index$/, '') + '/index';
    entry[key] = [
      path.join(options.pageContext, filename)
    ];

    if (options.isDev) {
      entry[key].unshift(require.resolve('react-dev-utils/webpackHotDevClient'));
    }
  }

  else {
    appPages.forEach(item => {
      if (pageNames && pageNames.length && pageNames.indexOf(item.name) === -1) {
        return;
      }

      const key = 'pages/' + item.name.replace(/\/index$/, '') + '/index';
      entry[key] = [
        item.file,
      ];

      if (options.isDev) {
        entry[key].unshift(require.resolve('react-dev-utils/webpackHotDevClient'));
      }
    });
  }

  if (!Object.keys(entry).length) {
    throw new Error('当前应用下，未找到匹配的页面');
  }

  return entry;

}


/**
 * 获取模板
 */
export function getAppTemplate(entry, options) {
  return Object.keys(entry).map(item => {
    const name = item.replace(/(^pages\/|\/index$)/g, '');
    const tplPath = path.join(options.layoutContext, name + '.html');

    return {
      filename: name + '.html',
      template: tplPath,
      inject: 'body',
      chunks: [item]
    }
  })
}


export function getRule (loaders, id) {
  for (let i = 0; i < loaders.length; i++) {
    const rule = loaders[i]
    if (rule.id === id) {
      return rule
    }
  }
}

