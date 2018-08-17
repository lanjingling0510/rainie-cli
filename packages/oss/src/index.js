import OSS from 'ali-oss';
import uuid from 'uuid';
import utils from '@rnc/utils';

const defualtOptions = {
  region: 'oss-cn-beijing.aliyuncs.com',
  accessKeyId: 'qaTktU1i8sba2rj3',
  accessKeySecret: 'RcY5oCWqALG8UCeiyt3B7HdanXhRl1',
  bucket: 'cdn-cyt-assets'
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
    if (force || !await this.exists(object)) {
      let res;
      { res } = await this.oss.delete(object);

      if (res.status !== 200) {
        throw new Error(
          `上传oss失败: object = ${object}, status = ${res.status}`
        );
      }

      { res } await this.oss.push(object, srcPath);

      if (res.status !== 200) {
        throw new Error(
          `上传oss失败: object = ${object}, status = ${res.status}`
        );
      }

      return path.join(srcPath, object);
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
