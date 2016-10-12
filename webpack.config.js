/**
 * Created by XRene on 16/8/20.
 */

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: ['./src/js/index.js'],
       /* vendor: ['react', 'react-dom']*/
    },
    output: {
        path: './dist/js',
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/dist',           //TODO
        /*chunkFilename: '[id].bundle.js'   //bundle生成的配置*/
    },
    //devtool: 'eval-source-map',  //配置生成source-map, 开发阶段可以使用
    devServer: {                //通过npm script带参数启动的webpack-dev-server会覆盖这些已经写好的配置文件
        //contentBase: './dist',    //静态服务器根目录
        //colors: true,               //终端颜色为彩色
        //inline: true,                //在entry入门里面添加webpack/hot/dev-server
        //hot: true                   //热替换,见下面的热替换插件
        proxy: {
            '/get': {
                target: 'localhost:3000',
                secure: false
            }
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'
                /*query: {
                    presets: ['es2015', 'react']
                }*/
            },
            {
                test: /\.less/,
                loader: 'style!css!less'
            },
            {
                test: /\.json/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(), 热替换模块, 在webpack-dev-server里面添加--hot命令后会自动将这个插件注入进来
       /* new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',   // 将公共模块提取，生成名为`vendors`bundle
            chunks: ['vendor'], //提取哪些模块共有的部分,名字为上面的vendor
            minChunks: Infinity // 提取至少*个模块共有的部分
        })*/
    ]
};
