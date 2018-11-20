'use strict'

const fs = require('fs')
const path = require('path')
const nunjucks = require('nunjucks')

module.exports = (pages) => {
  const templateContent = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8')
  const template = nunjucks.compile(templateContent)

  return function (req, res) {
    const content = template.render({
      pages: pages || []
    })

    res.set('content-type', 'text/html; charset=utf-8')
    res.end(content)
  }
}
