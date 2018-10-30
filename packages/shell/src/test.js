import shell from './index.js';

async function main() {
  const projectDir = '/Users/wb-cyt420097/ttfd/portal-demo-web';
  const stdout = await shell.exec(
      'rnc build home',
    { cwd: projectDir }
  );

}






main();
