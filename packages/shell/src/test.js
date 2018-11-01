import shell from './index.js';



async function main() {
  const projectDir = '/Users/wb-cyt420097/ttfd/portal-demo-web';
  await shell.exec(
    `rnc upload home`,
    { cwd: projectDir}
  );
}

main();
