import shell from './index.js';


const env = Object.create( process.env );
env.FORCE_COLOR = 1;

async function main() {
  const projectDir = '/Users/wb-cyt420097/ttfd/portal-demo-web';
  await shell.exec(
    `docker run --rm -v ${projectDir}:/data registry.cn-qingdao.aliyuncs.com/ttfd/portal-deploy-docker rnc build home`,
    { cwd: projectDir, env: env}
  );
}

main();
