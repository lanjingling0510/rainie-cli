import OSS from 'ali-oss';
import fs from 'fs';
import uuid from 'uuid';
import path from 'path';
import url from 'url';
import utils from '@rnc/utils';
import config from './config';

const defualtOptions = {
  region: config.region,
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: config.bucket
};

class OssClient {
  constructor(config) {
    this.ossConfig = Object.assign({}, defualtOptions, config);
    this.oss = new OSS(this.ossConfig);
  }

  async exists(object) {
    try {
      let { res } = await this.oss.head(object);
      if (res.status === 200) {
        return true;
      }
    } catch (err) {
      // ignore
    }

    return false;
  }

  async upload(object, srcPath, force = false) {

    // 检查指定目录是否可以覆盖文件
    if (force) {

      const del = await this.oss.delete(object);

      if (del.res.status < 200 || del.res.status > 300) {
        throw new Error(
          `上传oss失败: object = ${object}, status = ${del.res.status}`
        );
      }

      const push = await this.oss.put(object, srcPath);

      if (push.res.status !== 200) {
        throw new Error(
          `上传oss失败: object = ${object}, status = ${push.res.status}`
        );
      }
      return url.resolve(config.host, object);
    } else {
      return false;
    }
  }

  /**
   * 下载指定的 object
   * @param {String} object 下载的 object
   * @param {String} destPath 目标路径
   * @param {Boolean} force 是否强制下载
   */
  async download(object, destPath, force = false) {
    let cacheFile = path.join(destPath, object);

    // 检查指定目录是否可以覆盖文件
    if (force || await utils.canCoverDir(cacheFile)) {
      let dirname = path.dirname(cacheFile);

      // 确保缓存目录存在
      await fs.ensureDir(dirname);

      // 从 oss 下载
      let tmpFile = `${cacheFile}.${uuid.v4()}.tmp`;
      let { res } = await this.oss.get(object, tmpFile);

      if (res.status === 200) {
        await fs.rename(tmpFile, cacheFile);
        return cacheFile;
      } else {
        throw new Error(
          `下载oss失败: object = ${object}, status = ${res.status}`
        );
      }
    } else {
      return cacheFile;
    }
  }
}

export default OssClient;
