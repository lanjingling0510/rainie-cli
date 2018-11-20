'use strict'

const fs = require('fs')
const path = require('path')
const getIn = require('lodash.get')
const nunjucks = require('nunjucks')

const getLayout = (options) => {
  if (options.layout) {
    return fs.readFileSync(path.join(appDir, options.layout), 'utf-8')
  } else {
    // TODO: 变成从 portal 接口拿
    return fs.readFileSync(path.join(__dirname, './layout.html'), 'utf-8')
  }
}

module.exports = (appDir, options) => {
  // 模板内容
  const layoutContent = getLayout(appDir, options)
  const template = nunjucks.compile(layoutContent)

  return function (req, res) {
    const appName = getIn(req, 'params.app')
    const pageName = getIn(req, 'params.0', '') || ''

    // 如果是兼容模式下, 则会先查找 demo 目录下的模板
    let localLayout
    if (process.env.COMPATIBLE) {
      const localTplPath = path.join(appDir, 'demos', pageName)
      if (fs.existsSync(localTplPath)) {
        localLayout = fs.readFileSync(localTplPath, 'utf-8')
      }
    }

    let content = localLayout;
    res.set('Content-Type', 'text/html; charset=utf-8')
    res.end(content)
  }
}
