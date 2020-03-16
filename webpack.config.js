const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (_, argv) => {
  let mode = 'development'
  if (argv.mode) {
    mode = argv.mode
  } else if (process.env.NODE_ENV) {
    mode = process.env.NODE_ENV
  }
  const isDevelopment = mode === 'development'
  const isWatch = argv.liveReload || argv.watch || false

  // console.log(argv)
  console.log(`mode: ${mode}`)
  console.log(`isDevelopment: ${isDevelopment}`)
  console.log(`isWatch: ${isWatch}`)

  const GLOGAL_DEFINE = {
    'IS_DEVELOPMENT': JSON.stringify(isDevelopment || false),
    'IS_WATCH': JSON.stringify(isWatch || false),
    // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }

  const configMain = {
    name: 'main',
    mode: mode,
    // devtool: 'eval', // default
    devtool: 'source-map', // human readable
    externals: [nodeExternals()],
    entry: {
      index: './src/main'
    },
    target: 'electron-main',
    node: {
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }
      ]
    },
    output: {
      path: __dirname + '/build/main',
      // filename: 'main.js'
    },
    plugins: [
      new webpack.DefinePlugin(GLOGAL_DEFINE),
    ],
    resolve: {
      extensions: ['.js', '.ts']
    },
  }

  const configRenderer = {
    name: 'renderer',
    mode: mode,
    entry: {
      init: './src/renderer/init.tsx',
      // fonts: './src/renderer/fonts.ts'
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },
      ],
    },
    output: {
      path: __dirname + '/build/renderer',
      // filename: 'react.js'
    },
    plugins: [
      new webpack.DefinePlugin(GLOGAL_DEFINE),
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html.template'
      }),
      // new webpack.HotModuleReplacementPlugin()
    ],
  }

  const configNode = {
    name: 'node',
    mode: mode,
    // devtool: 'eval', // default
    devtool: 'source-map', // human readable
    externals: [nodeExternals()],
    entry: {
      index: './src/web'
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ]
    },
    output: {
      path: __dirname + '/build/web',
      // filename: 'main.js'
    },
    plugins: [
      new webpack.DefinePlugin(GLOGAL_DEFINE),
      // Copy by html-webpack
      // new HtmlWebpackPlugin({
      //   template: './src/web/public/index.html',
      //   filename: "public/index.html",
      //   excludeChunks: ['index'],
      //   alwaysWriteToDisk: true
      // }),
      // new HtmlWebpackHarddiskPlugin()
      // Copy by webpack
      new CopyWebpackPlugin(
        [
          { from: 'src/web/public', to: 'public/', },
        ],
      ),
      new WriteFilePlugin(),
    ],
    resolve: {
      extensions: ['.js', '.ts']
    },
  }

  return [
    configMain,
    configRenderer,
    configNode,
  ]
}