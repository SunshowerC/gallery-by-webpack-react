/**
 * Created by ChenWeiYu
 * Date : 2016/9/30
 * Time : 16:02
 */
var path = require('path');
var webpack = require('webpack');

var config = {
    // entry: ['webpack/hot/dev-server','webpack-dev-server/client?http://localhost:8080',path.resolve(__dirname, 'app/main.js')],
    entry: [path.resolve(__dirname, 'app/main.js')],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',//在webpack的module部分的loaders里进行配置即可
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style!css?modules'//添加对样式表的处理,  ?modules : css模块化，详情看文档
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer?{browsers:["last 5 version", "Firefox' +
                ' 15"]}!sass?sourceMap&outputStyle=compressed'
            },
            {
                test: /\.(jpg|png|gif|svg|woff)$/,
                loader: 'url-loader?name=imgs/[hash].[ext]&limit=8000'  //prefix=img/
                // loader: 'url-loader?prefix=img/&limit=8000'  //prefix=img/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({   //将React切换到产品环境，开发环境下请注释掉
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({   //压缩
            output: {
                comments: false  // remove all comments
            },
            compress: {
                warnings: false
            }
        })

    ],

    //webpack-dev-server 配置项
    devServer: {
        contentBase: "./build",//本地服务器所加载的页面所在的目录
        colors: true,//终端中输出结果为彩色
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    }
};
module.exports = config;