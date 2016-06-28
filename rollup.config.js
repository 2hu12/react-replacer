import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'index.js',
  dest: 'index.umd.js',
  format: 'umd',
  moduleName: 'reactReplacer',
  plugins: [
    babel({
      exclude: [
        'node_modules/**'
      ],
      presets: ['es2015-rollup'],
      babelrc: false
    })
  ]
}
