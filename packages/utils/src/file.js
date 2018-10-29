import os from 'os';
import path from 'path';
import fs from 'fs';

export default {
  /**
   * 获取临时目录
   *
   * @param {String} random 是否生成随时临时目录
   * @return {String}
   */
  tmpdir(random) {
    let tmpdir;

    if (process.platform === 'win32') {
      tmpdir = os.tmpdir();
    } else {
      // 默认用 .just_tmp 目录
      tmpdir = path.join(process.env.HOME || os.homedir(), '.rnc_tmp');

      try {
        if (!this.exists(tmpdir)) {
          fs.mkdirSync(tmpdir);
        }
      } catch (err) {
        // 如果创建 tmpdir 失败, 就直接用系统的
        tmpdir = os.tmpdir();
      }
    }

    if (random) {
      const name = `rnc-tmp-${Date.now()}-${Math.ceil(Math.random() * 1000)}`;
      tmpdir = path.join(tmpdir, name);

      fs.mkdirSync(tmpdir);

      return tmpdir;
    } else {
      return tmpdir;
    }
  }
};
