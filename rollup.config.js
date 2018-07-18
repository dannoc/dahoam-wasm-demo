import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.mjs',
  output: {
    file: 'public/bundle.mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(), // tells Rollup how to find dependencies in node_modules
    commonjs(), // converts dependencies to ES modules
    production && minify(), // minify, but only in production
  ]
};
