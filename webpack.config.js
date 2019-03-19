const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'embed.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'crm',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                ['@babel/preset-env', {
                  targets: {
                    ie: '11'
                  }
                }]
            ],
            plugins: [
                "transform-class-properties",
                "add-module-exports"
            ]
          }
        },
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  }
};
