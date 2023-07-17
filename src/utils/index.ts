import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { lookupFile } from './sys';
import { createFilter as _createFilter } from '@rollup/pluginutils';
import { DEFAULT_OUTPUT_CONFIG, DEFAULT_EXTENSIONS } from './constant';
export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('..', import.meta.url));

export function loadConfigfile(
  configFile?: string,
  configRoot = process.cwd()
) {
  let reslovePath;
  if (configFile) {
    reslovePath = path.resolve(configFile);
  } else {
    for (const fileName of DEFAULT_OUTPUT_CONFIG) {
      const configPath = path.resolve(configRoot, fileName);
      if (!fs.existsSync(configPath)) continue;
      reslovePath = configPath;
    }
  }
  if (!reslovePath) {
    console.log('请添加dunk.config.ts或者dunk.config.js配置文件');
    return false;
  } else {
    console.log('配置写入成功');
    return reslovePath;
  }
}

export function isESM(resolvedPath) {
  let isESM = false;
  if (/\.m[jt]s$/.test(resolvedPath)) {
    isESM = true;
  } else if (/\.c[jt]s$/.test(resolvedPath)) {
    isESM = false;
  } else {
    // check package.json for type: "module" and set `isESM` to true
    try {
      const pkg = lookupFile(process.cwd(), ['package.json']);
      isESM =
        !!pkg && JSON.parse(fs.readFileSync(pkg, 'utf-8')).type === 'module';
    } catch (e) {
      console.log(e);
    }
  }
  return isESM;
}
export type FilterPattern =
  | ReadonlyArray<string | RegExp>
  | string
  | RegExp
  | null;
export const createFilter = _createFilter as (
  include?: FilterPattern,
  exclude?: FilterPattern,
  options?: { resolve?: string | false | null }
) => (id: string | unknown) => boolean;
