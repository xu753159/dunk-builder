import { loadConfigfile, isESM } from '../utils/index';

import { bundleConfigFile } from '@/utils/reslove';
const configPath = loadConfigfile();
async function getUserConfig() {
  if (configPath) {
    console.log(configPath);
    const result = await bundleConfigFile(configPath, true);
    console.log(result);
    // console.log(bundleConfigFile)
  }
}
getUserConfig();
