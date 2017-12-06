const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const minify = require('uglify-es').minify;
const prettier = require('rollup-plugin-prettier');

const isProduction = (process.env.NODE_ENV === 'production');
const FORMAT = process.env.BABEL_ENV;

const config = {
  input: 'src/index.js',
  plugins: [],
  output: {
    format: FORMAT
  }
};

switch (FORMAT) {
  case 'umd':
    config.name = 'Baggage';
    config.plugins.push(
      nodeResolve({
        jsnext: true
      }),
      babel({
        exclude: 'node_modules/**'
      })
    );
    break;
  case 'es':
  case 'cjs':
  default:
    config.plugins.push(
      babel()
    );
    break;
}

if (isProduction) {
  switch (FORMAT) {
    case 'es':
      config.plugins.push(
        uglify({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false
          }
        }, minify)
      );
      break;
    case 'umd':
    case 'cjs':
    default:
      config.plugins.push(
        uglify({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false
          }
        })
      );
      break;
  }
} else {
  config.plugins.push(prettier());
}

export default config;