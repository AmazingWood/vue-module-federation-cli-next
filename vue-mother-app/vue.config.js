const { ModuleFederationPlugin } = require('webpack').container
const deps = require('./package.json').dependencies

const moduleFederationName = 'motherApp'
const moduleFederationPath = process.env.NODE_ENV === 'production' ? 'http://localhost:3000/vue-mother-app/' : 'http://localhost:3000/'

module.exports = {
  publicPath: moduleFederationPath,
  devServer: {
    port: 3000,
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].excludeChunks = [
          moduleFederationName
        ]
        return args
      })
  },
  configureWebpack: {
    experiments: {
      topLevelAwait: true
    },
    plugins: [
      new ModuleFederationPlugin({
        name: moduleFederationName,
        library: {
          type: 'var',
          name: moduleFederationName
        },
        filename: process.env.NODE_ENV === 'production' ? 'remoteEntry.[contenthash:8].js' : 'remoteEntry.js',
        exposes: {
          './BlueBox' : './src/components/BlueBox/index.vue'
        },
        shared: {
          ...deps,
          vue: {
            requiredVersion: deps.vue,
            singleton: true
          }
        }
      })
    ]
  }
}
