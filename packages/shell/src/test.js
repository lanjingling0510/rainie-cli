import shell from './index.js';


async function main() {
  const projectDir = '/Users/wb-cyt420097/ttfd/portal-demo-web';
  const dockerCmd = `docker run --rm -v ${projectDir}:/data registry.cn-qingdao.aliyuncs.com/ttfd/portal-deploy-docker `;
  await shell.exec(
    `${dockerCmd} rnc upload`,
    { cwd: projectDir}
  );
}

main();
