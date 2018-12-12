const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins:[
    new HtmlWebpackPlugin({
        title: "Muse 2016 experiment with jsPsych",
        template:"./src/index.html"
    })
  ],
  "devtool":"eval-source-map"

};