import plugin from '@rnc/plugin-core';


export const gitCommit = (msg) =>
  plugin('gitCommit', async () => {
    const {commit} = require('@rnc/git');
    await commit(msg);
  });

export const gitPush = () =>
  plugin('gitPush', async () => {
    const {push} = require('@rnc/git');
    await push();
  });

export const updatePackageVersion = (version) =>
  plugin('updatePackageVersion', async () => {
    const {updatePackageVersion} = require('@rnc/git');
    await updatePackageVersion(version);
  });

export const releaseCurrentBranch = (version) =>
  plugin('releaseCurrentBranch', async () => {
    const {releaseCurrentBranch} = require('@rnc/git');
    await releaseCurrentBranch(version);
  });



