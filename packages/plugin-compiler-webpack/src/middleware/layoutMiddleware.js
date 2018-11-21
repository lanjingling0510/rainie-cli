'use strict'

const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks');


module.exports = (options) => {


  const layoutContent = fs.readFileSync(path.join(__dirname, './layout.html'), 'utf-8');
  const template = nunjucks.compile(layoutContent);

  return function (req, res) {
    // 模板内容
    const pageName = req.params[0];
    const localTplPath = path.join(options.layoutContext, pageName)

    let content;
    // 会先查找 项目下目录的模板
    if (fs.existsSync(localTplPath)) {
      content = fs.readFileSync(localTplPath, 'utf-8')
    } else {
      content = template.render({
        pageName: pageName.replace('.html', ''),
      });
    }

    res.set('Content-Type', 'text/html; charset=utf-8')
    res.end(content)
  }
}
