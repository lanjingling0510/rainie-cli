

import chalk from 'chalk';
import width from 'string-width';

function padding(text, maxLen, alignRight) {
  let currLen = width(text)

  if (alignRight) {
    return ' '.repeat(maxLen - currLen) + text
  } else {
    return text + ' '.repeat(maxLen - currLen)
  }
}


export default {
  /**
   * 打印头部
   */
  header(header, notes) {
    if (notes) {
      console.log(
        '%s %s\n',
        chalk.magenta(`[${header}]`),
        chalk.white(`(${notes})`)
      );
    } else {
      console.log(chalk.magenta('[%s]\n'), header);
    }
  },
  /**
   * 打印进度
   */
  progress() {
    let args = Array.prototype.slice.apply(arguments);
    args[0] = chalk.white('> ' + args[0]);

    console.log.apply(console, args);
  },
  /**
   * 打印列表
   * @param {Array} rows 二维数组
   * @param {Array} colors 每一列的色彩名称 (chalk 所支持的色彩)
   * @param {String} emptyMsg 空数据时显示的消息
   */
  list(rows, colors, emptyMsg) {
    colors = colors || [];

    if (!rows.length) {
      console.log('%s\n', emptyMsg || '无');
      return;
    }

    let maxs = [];

    // get max for each column
    rows.forEach(row => {
      row.forEach((col, i) => {
        if (typeof maxs[i] === 'undefined') {
          maxs[i] = 0;
        }

        if (maxs[i] < width(col)) {
          maxs[i] = width(col);
        }
      });
    });

    // print by row
    rows.forEach(row => {
      let line = [];

      row.forEach((col, i) => {
        let padded = padding(col, maxs[i]);
        if (colors[i]) {
          padded = chalk[colors[i]](padded);
        }

        line.push(padded);
      });

      console.log(line.join('  '));
    });
    console.log();
  },
  /**
   * print props
   *
   * opts: {
   *   keyColor: String,
   *   alignRight: Boolean,
   *   filter: Function,
   *   divider: Boolean,
   *   emptyMsg: String,
   *   indent: Number
   * }
   *
   * @param  {Object} props
   * @param  {Object} opts
   */
  props(props, opts) {
    opts = opts || {};

    let maxKeyLen = Math.max.apply(null, Object.keys(props).map(n => width(n)));

    if (opts.divider) {
      console.log(chalk.white('------------------------'));
    }

    if (Object.keys(props).length) {
      let indent = ' '.repeat(opts.indent || 0);

      for (let k in props) {
        let key = padding(k, maxKeyLen + 2, opts.alignRight);
        let value = opts.filter ? opts.filter(props[k]) : props[k];

        console.log('%s%s  %s', indent, chalk.cyan(key), value);
      }
    } else {
      console.log(opts.emptyMsg || '无');
    }

    if (opts.divider) {
      console.log(chalk.white('------------------------'));
    }

    console.log();
  },
};
