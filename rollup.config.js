import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ReactDND',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    })
  ]
}; 