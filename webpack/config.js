
const path = require("path");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const basepath = path.resolve();


// webpack base

var webpackConfig = {

    mode: "development",
    
    resolve: {
        alias: {
            "__base": path.resolve(basepath, "./"),
            "__src": path.resolve(basepath, "./src"),
            // "__stores": path.resolve(basepath, "./src/stores"),
            // "__styles": path.resolve(basepath, "./src/styles"),
            // "__views": path.resolve(basepath, "./src/views"),
            // "__components": path.resolve(basepath, "./src/components"),
        }
    },

    entry: {
        app: ["@babel/polyfill", "./src/index.js"],
    },

    output: {
        path: path.resolve(basepath, 'dist'),
        filename: '[name].[hash:8].js',
        chunkFilename: 'chunks/[name].[contenthash:8].js'
    },
    
    externals: {
        // "GUTILS": "GUTILS",
        ENGINE3D: "ENGINE3D"
    },
    

    module: {
        rules: [

            // js jsx transpile
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "@babel/plugin-syntax-dynamic-import"
                        ]
                    }
                }
            },

            // font and svg loader (necessario per usare le icone di icomoon)
            { test: /\.svg$/, loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
            { test: /\.woff$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
            { test: /\.woff2$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
            { test: /\.[ot]tf$/, loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
            { test: /\.eot$/, loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' },

        ]
    }
};

// plugins base

var plugins = [

    // ##OLD
    // new HtmlWebPackPlugin({
    //     template: "./src/index.html",
    //     filename: "./index.html"
    // }),
    // new MiniCssExtractPlugin({
    //     filename: "chunks/[name].[contenthash:8].css",
    //     chunkFilename: "chunks/[name].[contenthash:8].css"
    // }),
    
];
webpackConfig.plugins = plugins;


module.exports = webpackConfig;









