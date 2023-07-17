import path from 'node:path';
import fs from 'fs';
import { builtinModules } from 'node:module';
import { NODE_BUILTIN_NAMESPACE } from './constant';
import os from 'node:os';
import { exec } from 'node:child_process';

export function lookupFile(
  dir: string,
  fileNames: string[]
): string | undefined {
  while (dir) {
    for (const fileName of fileNames) {
      const fullPath = path.join(dir, fileName);
      if (tryStatSync(fullPath)?.isFile()) return fullPath;
    }
    const parentDir = path.dirname(dir);
    if (parentDir === dir) return;

    dir = parentDir;
  }
}
export function tryStatSync(filePath: string): fs.Stats | undefined {
  try {
    return fs.statSync(filePath, { throwIfNoEntry: false });
  } catch {
    return undefined;
  }
}
const builtins = new Set([
  'assert/strict',
  'diagnostics_channel',
  'dns/promises',
  'fs/promises',
  'path/posix',
  'path/win32',
  'readline/promises',
  'stream/consumers',
  'stream/promises',
  'stream/web',
  'timers/promises',
  'util/types',
  'wasi',
  ...builtinModules
]);
export function isBuiltin(id: string): boolean {
  return builtins.has(
    id.startsWith(NODE_BUILTIN_NAMESPACE)
      ? id.slice(NODE_BUILTIN_NAMESPACE.length)
      : id
  );
}
const postfixRE = /[?#].*$/s;
const windowsNetworkMap = new Map();

export function cleanUrl(url: string): string {
  return url.replace(postfixRE, '');
}
export const isWindows = os.platform() === 'win32';
const parseNetUseRE = /^(\w+) +(\w:) +([^ ]+)\s/;

export let safeRealpathSync = isWindows
  ? windowsSafeRealPathSync
  : fs.realpathSync.native;
let firstSafeRealPathSyncRun = false;

function optimizeSafeRealPathSync() {
  exec('net use', (error, stdout) => {
    if (error) return;
    const lines = stdout.split('\n');
    // OK           Y:        \\NETWORKA\Foo         Microsoft Windows Network
    // OK           Z:        \\NETWORKA\Bar         Microsoft Windows Network
    for (const line of lines) {
      const m = line.match(parseNetUseRE);
      if (m) windowsNetworkMap.set(m[3], m[2]);
    }
    if (windowsNetworkMap.size === 0) {
      safeRealpathSync = fs.realpathSync.native;
    } else {
      safeRealpathSync = windowsMappedRealpathSync;
    }
  });
}
function windowsSafeRealPathSync(path: string): string {
  if (!firstSafeRealPathSyncRun) {
    optimizeSafeRealPathSync();
    firstSafeRealPathSyncRun = true;
  }
  return fs.realpathSync(path);
}

function windowsMappedRealpathSync(path: string) {
  const realPath = fs.realpathSync.native(path);
  if (realPath.startsWith('\\\\')) {
    for (const [network, volume] of windowsNetworkMap) {
      if (realPath.startsWith(network))
        return realPath.replace(network, volume);
    }
  }
  return realPath;
}
