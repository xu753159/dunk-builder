import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import reslove from '@rollup/plugin-node-resolve';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
console.log(__dirname);
export default {
  input: 'src/main.ts',
  output: {
    dir: './dist',
    entryFileNames: `node/[name].js`,
    chunkFileNames: 'node/chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
    externalLiveBindings: false,
    freeze: false
  },
  plugins: [
    reslove(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true, clean: true })
  ]
};
