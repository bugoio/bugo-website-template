const webpack = require('webpack');
const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const styles = (env) => { 

  const style = 'compressed'
  const ext = '.css'


  return {
    entry: {
      'styles': './src/sass/index.scss',
    },
    output: {
      path: path.resolve(__dirname, 'assets/css'),
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: style, // figure out how to make this conditional Node env?
                  sourceComments: false,
                  includePaths: ['node_modules']
                },
              },
            },
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new FixStyleOnlyEntriesPlugin(),
      new MiniCssExtractPlugin({
        filename: `[name]${ext}`,
        chunkFilename: `[id]${ext}`,
      }),
    ],
  }
};

const stylesMin = (env) => { 

  const style = 'compressed'
  const ext = '.css'


  return {
    entry: {
      'styles.min': './src/sass/index.scss',
    },
    output: {
      path: path.resolve(__dirname, 'assets/css'),
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: style, // figure out how to make this conditional Node env?
                  sourceComments: false,
                  includePaths: ['node_modules']
                },
              },
            },
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new FixStyleOnlyEntriesPlugin(),
      new MiniCssExtractPlugin({
        filename: `[name]${ext}`,
        chunkFilename: `[id]${ext}`,
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    ],
  }
};


const app = {
  entry: [
    "@babel/polyfill",
    "./src/js/app.js",
  ],
  output: {
    path: path.resolve(__dirname, "assets", "js"),
    filename: `app.js`
  },
  externals: ["fs"],
  mode: "development",
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new MinifyPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        uglifyOptions: {
          output: {
            extractComments: {
              condition: /^\**!|@preserve|@license|@cc_on/i,
              filename: 'extracted-comments.js',
              banner(licenseFile) {
                return `License information can be found in ${licenseFile}`;
              },
            },
          }
        }
      })
    ]
  },
  watch: true
};

const search = {
  entry: [
    "@babel/polyfill",
    "./src/js/search.js",
  ],
  output: {
    path: path.resolve(__dirname, "assets", "js"),
    filename: `search.js`
  },
  externals: ["fs"],
  mode: "development",
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new MinifyPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        uglifyOptions: {
          output: {
            extractComments: {
              condition: /^\**!|@preserve|@license|@cc_on/i,
              filename: 'extracted-comments.js',
              banner(licenseFile) {
                return `License information can be found in ${licenseFile}`;
              },
            },
          }
        }
      })
    ]
  },
  watch: true
};

const custom = {
  entry: [
    "@babel/polyfill",
    "./src/js/custom.js",
  ],
  output: {
    path: path.resolve(__dirname, "assets", "js"),
    filename: `custom.js`
  },
  externals: ["fs"],
  mode: "development",
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new MinifyPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        uglifyOptions: {
          output: {
            extractComments: {
              condition: /^\**!|@preserve|@license|@cc_on/i,
              filename: 'extracted-comments.js',
              banner(licenseFile) {
                return `License information can be found in ${licenseFile}`;
              },
            },
          }
        }
      })
    ]
  },
  watch: true
};


module.exports = [styles,stylesMin,app,search,custom]