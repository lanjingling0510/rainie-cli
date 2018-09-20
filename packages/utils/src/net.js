import os from 'os';

export default {
  /**
   * 下载资源到指定目录
   *
   * @param  {String} url [description]
   * @param  {String} dir 目录名
   * @return {Promise} 返回文件信息列表
   */
  download(url, dir) {
    const download = require('download');
    return download(url, dir, { extract: true });
  },
  /**
   * 获取本地IP
   *
   * @return {String}
   */
  getLocalIp() {
    let ifs = os.networkInterfaces();

    for (let type in ifs) {
      let found = ifs[type].find(item => {
        return item.family === 'IPv4' && !item.internal;
      });

      if (found) {
        return found.address;
      }
    }

    return '127.0.0.1';
  }
};
