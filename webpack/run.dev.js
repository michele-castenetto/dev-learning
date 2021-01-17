const path = require("path");
const fsutils = require("../tools/fsutils");
const fse = require('fs-extra');
const chalk = require("chalk");
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const config = require("./config.js");


// const { Response } = require("../src/modules/network.model");

const basepath = path.resolve();
const distPath = path.join(basepath, "dist");


const _readBuildConfig = function () {
    const buildConfig = fsutils.readJsonSync(path.join(basepath, "build.json"));
    return buildConfig;
};



/**
 * Development config
 */

// const buildConfig = _readBuildConfig();

// const buildEntry = path.join(basepath, buildConfig.buildPath, "index.js");
const buildEntry = path.join(basepath, "src", "index.js");

// const clientPath = path.join(basepath, buildConfig.buildPath);

const stylePath = path.join(basepath, "src", "styles");

// # alias path cliente
// config.resolve.alias.__clientPath = clientPath;

// # build entry point
config.entry.app = ["@babel/polyfill", buildEntry];

// # mode
config.mode = "development";


// # map files generation
config.devtool = "source-map";
// config.devtool = "eval-source-map";
// config.devtool = 'inline-source-map';



// # css/scss rules
config.module.rules.push({
    test: /\.(css|scss)$/,
    use: [
        {
            loader: 'style-loader',
        },
        {
            loader: "css-loader",
        },
        {
            // ##REF https://stackoverflow.com/questions/35937477/how-to-use-absolute-path-to-import-custom-scss-when-using-react-webpack
            loader: "sass-loader",
            options: {
                includePaths: [
                    basepath
                ],
            }
        }
    ],

});







// # progress bar 
config.plugins.push(
    new ProgressBarPlugin({
        format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
    })
);

// # hot replacement
// ##TODO capire come funziona
// config.plugins.push(new webpack.HotModuleReplacementPlugin());




// # index.html 
// const indexHtmlPath = buildConfig.indexHtmlPath || "./src/index.html";
const indexHtmlPath = "./src/index.html";
config.plugins.push(
    new HtmlWebPackPlugin({
        template: indexHtmlPath,
        filename: "./index.html"
    })
);


// # external assets
// const externalAssets = buildConfig.externals.dev;
// config.plugins.push(
//     new HtmlWebpackTagsPlugin({
//         tags: externalAssets,
//         append: false,
//         // hash: true,
//         hash: function (path, hash) { return path + '?' + hash; }
//     })
// );



const compiler = webpack(config);


// https://webpack.js.org/configuration/dev-server/
const devServerOptions = {

    port: 8082,

    // # apre una finestra del browser all'avvio
    open: true,
    
    // # per usare gzip
    compress: true,

    // # configurazione risultati della compilazione
    stats: { 
        // Add console colors
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    },
    
    // # This option lets the browser open with your local IP.
    // useLocalIp: true,

    // # The bundled files will be available in the browser under this path
    // publicPath: '/',

    // # Tell the server where to serve content from. This is only necessary if you want to serve static files.
    // contentBase: "./",
    
    // # When set to true this option bypasses host checking
    // per poter vedere da altri dispositivi l'app
    disableHostCheck: true,
    // # When using the HTML5 History API, the index.html page will likely have to be served in place of any 404 responses
    // per usare il routing con la history invece di quello con l'hash
    historyApiFallback: true,
    
    
    // ##TODO per servire le immagini e le icone "ad clientem" ?
    proxy: {
        '/public': {
            target: 'http://localhost:8081',
            pathRewrite: {'^/public' : '/assets'}
        }
    },
    // ##EXAMPLE
    // proxy: {
    //     '/static': {
    //         target: 'http://localhost:3333',
    //         pathRewrite: {'^/static' : '/app/static'}
    //      }
    // }


    // # api di test
    before: function(app, server, compiler) {
        app.get('/api/ping', function (req, res) {
            // res.json(new Response());
        });
        app.get('/api/test', function (req, res) {
            // res.json(new Response({ data: "test data" }) );
        });
    },
    // setup: function (app, server) {
    //     app.get('/api/ping', function (req, res) {
    //         res.json(new Response());
    //     });
    //     app.get('/api/test', function (req, res) {
    //         res.json(new Response({ data: "test data" }) );
    //     });
    // },
    
    // # configurazione https
    // https: true,
    // https: {
    //     key: fs.readFileSync('/path/to/server.key'),
    //     cert: fs.readFileSync('/path/to/server.crt'),
    //     ca: fs.readFileSync('/path/to/ca.pem'),
    // },

    // # scrive i file che genera nella cartella output.path
    // writeToDisk: true,
    // writeToDisk: (filePath) => {
    //     return /superman\.css$/.test(filePath);
    // }
    
    // ##TODO capire cosa ulteriormente serve per attivarlo
    hot: true, 

};


const server = new WebpackDevServer(compiler, devServerOptions);


let msg = `\n ${chalk.cyan("[INFO]")} ${chalk.gray("Starting the dev web server...")} \n`;
console.log(msg);

const port = devServerOptions.port;
server.listen(port, 'localhost', function (err) {
    if (err) { console.log(err); }
    msg = `\n ${chalk.cyan("[INFO]")} ${chalk.gray(`WebpackDevServer listening at localhost:${port}`)} \n`;
    console.log(msg);
});

