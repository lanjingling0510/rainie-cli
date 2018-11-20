import path from 'path';
import globby from 'globby';

function normalizeOptions(options) {
  options = Object.assign({}, options)
  options.feature = options.feature || {};

  // wrapper
  if (process.env.ELEMENT_WRAPPER) {
    options.feature.elementWrapper = process.env.ELEMENT_WRAPPER;
  }

  // fix options `rnc dev [pages]`
  if (options.pageDir) {
     // 通过参数指定入口
    options.pages = options.pageDir.split(',')
  } else if (process.env.PAGE_DIR) {
    // 通过环境变量指定入口
    options.pages = process.env.PAGE_DIR.split(',');
  } else if (process.env.SPEC_ENTRY) {
    // 强制指定某个 js 入口文件进行编译
    options.specifiedEntry = process.env.SPEC_ENTRY;
  }

  if (process.env.NODE_ENV === 'development') {
    options.isDev = true;
  } else {
    options.isDev = false;
  }

  return options;
}


function getAppPages(pageContext) {
  const pages =  globby.sync(['*'], {
    cwd: pageContext
  });

  return pages.map(page => ({
    name: page,
    entry: `pages/${page}/index`,
    file: path.join(pageContext, page, 'index.js'),
  }))
}


function getAppEntry (options) {
  const {pages, pageContext} = options;
  const appPages = getAppPages(pages, options.pageContext);
  const entry = {};

  // specfied entry 目录相对于 src/pages
  if (options.specifiedEntry) {
    const filename = options.specifiedEntry.replace(/(^\.\/|\.jsx?$)/g, '').replace('\\', '/');
    const key = 'pages/' + filename.replace(/\/index$/, '') + '/index';
    entry[key] = [
      path.join(pageContext, options.specifiedEntry),
    ];

    if (options.isDev) {
      entry[key].unshift(require.resolve('react-dev-utils/webpackHotDevClient'));
    }

  } else {
    appPages.forEach(item => {
      // 如果定义了 pages, 但 item 不在 pages 列表里, 就过滤掉
      if (pages && pages.length && !pages.includes(item.name)) {
        return
      }
      entry[item.entry] = [
        item.file
      ];

      if (options.isDev) {
        entry[item.entry].unshift(require.resolve('react-dev-utils/webpackHotDevClient'));
      }
    });
  }

  if (!Object.keys(entry).length) {
    throw new Error('当前应用下, 未找到匹配的页面')
  }

  return entry;
}
