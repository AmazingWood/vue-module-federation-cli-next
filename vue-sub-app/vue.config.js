const { ModuleFederationPlugin } = require('webpack').container 
const deps = require('./package.json').dependencies

const moduleFederationName = 'subApp'
const moduleFederationPath = process.env.NODE_ENV === 'production' ? 'http://localhost:3000/vue-sub-app/' : 'http://localhost:3001/'

module.exports = {
  publicPath: moduleFederationPath,
  devServer: {
    port: 3001
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].excludeChunks = [
          moduleFederationName // don't include remoteEntry.js to index.html
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
        remotes: {
          motherApp: 'motherApp@http://localhost:3000/remoteEntry.js'
        },
        filename: process.env.NODE_ENV === 'production' ? 'remoteEntry.[contenthash:8].js' : 'remoteEntry.js',
        shared: {
          ...deps
        }
      })
    ]
  }
}
