import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import reslove from '@rollup/plugin-node-resolve';
export default {
  input: 'src/main.ts',
  output: [
    {
      dir: './dist',
      entryFileNames: `es/[name].js`,
      chunkFileNames: 'es/chunks/dep-[hash].js',
      exports: 'named',
      format: 'esm',
      externalLiveBindings: true,
      freeze: false
    },
    {
      dir: './dist',
      format: 'cjs',
      entryFileNames: `node/[name].js`,
      chunkFileNames: 'node/chunks/dep-[hash].js',
      externalLiveBindings: true,
      freeze: false
    }
  ],
  external: ['esbuild'],
  plugins: [
    reslove(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true, clean: true })
  ]
};
