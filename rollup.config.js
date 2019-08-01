const { peerDependencies } = require('./package.json')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const terser = require('rollup-plugin-terser').terser

const deps = [...Object.keys(peerDependencies || {})]

const inputOutputConfig = (outputFile, outputFormat, commonOutput = {}) => ({
  input: 'src/index.js',
  output: {
    file: `${outputFile}`,
    format: outputFormat,
    ...commonOutput,
  },
})

const productionBuildPlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  terser({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
      arguments: true,
      toplevel: true,
      unsafe_Function: true,
      module: true,
      unsafe_proto: true,
    },
    mangle: {
      properties: {
        reserved: [
          'model',
          'deserialize',
          'serialize',
          'data',
          'inspectors',
          'response',
          'request',
          'isError',
          'KinkaSerializy',
        ],
      },
      module: true,
      toplevel: true,
    },
  }),
]

module.exports = [
  // Common JS builds
  {
    ...inputOutputConfig('lib/kinka-serializy.js', 'cjs'),
    external: deps,
    plugins: [resolve(), babel()],
  },
  {
    ...inputOutputConfig('lib/kinka-serializy.min.js', 'cjs'),
    external: deps,
    plugins: [resolve(), babel(), ...productionBuildPlugins],
  },

  // EcmaScript builds
  {
    ...inputOutputConfig('es/kinka-serializy.js', 'es'),
    external: deps,
    plugins: [resolve(), babel()],
  },
  {
    ...inputOutputConfig('es/kinka-serializy.mjs', 'es'),
    external: deps,
    plugins: [resolve(), babel(), ...productionBuildPlugins],
  },

  // UMD builds
  {
    ...inputOutputConfig('dist/kinka-serializy.js', 'umd', {
      name: 'KinkaSerializy',
    }),
    external: deps,
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  },
  {
    ...inputOutputConfig('dist/kinka-serializy.min.js', 'umd', {
      name: 'KinkaSerializy',
    }),
    external: deps,
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      ...productionBuildPlugins,
    ],
  },
]
