import shell from './index.js';

async function main() {
  const projectDir = '/Users/wb-cyt420097/ttfd/portal-demo-web';
  await shell.exec(
      `docker run --rm -v ${projectDir}:/data registry.cn-qingdao.aliyuncs.com/ttfd/portal-deploy-docker rnc build home --color`,
    { cwd: projectDir }
  );

}






main();
