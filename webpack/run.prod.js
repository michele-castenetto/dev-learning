
const path = require("path");
const fsutils = require("../tools/fsutils");
const fse = require('fs-extra');
const chalk = require("chalk");
const gulp = require("gulp");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackOnBuildPlugin = require('on-build-webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const { isGitRepo, getCommit } = require("./getCommit");

const config = require("./config.js");

const basepath = path.resolve();
const distPath = path.join(basepath, "dist");




const _readConfig = function () {
    let configPath = path.join(basepath, "config");
    let config = fsutils.readJsonSync(path.join(configPath, "config.json"));
    if (config.configPath) {
        configPath = config.configPath;
        config = fsutils.readJsonSync(path.join(configPath, "config.json"));
    }
    return { config, configPath };
};


const _readBuildConfig = function () {
    const buildConfig = fsutils.readJsonSync(path.join(basepath, "build.json"));
    return buildConfig;
};


var _writeConfigFile = function () {

    const configDistPath = path.join(distPath, "config");
    fsutils.ensureDirSync(configDistPath);

    const { config, configPath } = _readConfig();

    const settingsObj = Object.assign({}, config.settings, {
        datapath: "./data/"
    });
    const configObj = Object.assign({}, config, {
        settings: settingsObj
    });

    fsutils.writeJsonSync(path.join(configDistPath, "config.json"), configObj);

    // let engineConfig = fsutils.readJsonSync(path.join(configPath, "engine.json"));

    // fsutils.writeJsonSync(path.join(configDistPath, "engine.json"), engineConfig);
    
};


var _writeVersionFile = function () {

    const packageJson = fsutils.readJsonSync(path.join(basepath, "package.json"));
    
    const commit = isGitRepo() ? getCommit() : "";
    
    const d = new Date();
    
    const versionObj = { 
        version: packageJson.version ,
        commit: commit,
        build_date: d.toISOString(),
    };

    fsutils.writeJsonSync(path.join(distPath, "version.json"), versionObj);

};


const _copyExternals = function () {

    // const buildConfig = _readBuildConfig();
    let externalAssets = buildConfig.externals.prod;

    const destPath = path.resolve(distPath, "./externals");

    externalAssets.push("externals/version.json");
    
    gulp.task('copy_externals', function () {
        return gulp.src(externalAssets)
            .pipe(gulp.dest(destPath));
    });

    gulp.series('copy_externals')();

};


const _copyData = function () {

    const { config, configPath } = _readConfig();

    const dataPath = path.join(basepath, config.settings.datapath);
    
    const srcPaths = `${dataPath}/**/*`;

    const destPath = path.join(distPath, "data");

    gulp.task('copy_data', function () {
        return gulp.src(srcPaths)
            .pipe(gulp.dest(destPath));
    });

    gulp.series('copy_data')();

};


const _copyImages = function () {

    // const buildConfig = _readBuildConfig();
    const imagesPath = path.join(basepath, "images");
    const srcPaths = `${imagesPath}/**/*`;

    const destPath = path.resolve(distPath, "./images");

    gulp.task('copy_images', function () {
        return gulp.src(srcPaths, { base: "images" })
            .pipe(gulp.dest(destPath));
    });

    gulp.series('copy_images')();

};


const _copyIcons = function () {

    // const buildConfig = _readBuildConfig();
    const iconsPath = path.join(basepath, "icons");
    const srcPaths = `${iconsPath}/**/*`;

    const destPath = path.resolve(distPath, "./icons");

    gulp.task('copy_icons', function () {
        return gulp.src(srcPaths, { base: "icons" })
            .pipe(gulp.dest(destPath));
    });

    gulp.series('copy_icons')();

};


/**
 * App data and files
 */


fse.emptyDirSync(distPath);
fse.removeSync(distPath);


fsutils.ensureDirSync(distPath);


_writeConfigFile();
_writeVersionFile();
_copyData();
// _copyExternals();
_copyImages();
_copyIcons();



/**
 * Production config
 */

// const buildConfig = _readBuildConfig();

// const buildEntry = path.join(basepath, buildConfig.buildPath, "index.js");
const buildEntry = path.join(basepath, "src", "index.js");

// const clientPath = path.join(basepath, buildConfig.buildPath);

// const stylePath = path.join(basepath, "src", "styles");


// # alias path cliente
// config.resolve.alias.__clientPath = clientPath;

// # build entry point
config.entry.app = ["@babel/polyfill", buildEntry];

// # mode
config.mode = "production";

// # output
config.output.filename = '[name].[contenthash:8].js';


// # map files generation
// config.devtool = 'source-map';



// # css/scss rules
config.module.rules.push({
    test: /\.(css|scss)$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: "css-loader",
        },
        {
            // ##REF https://stackoverflow.com/questions/35937477/how-to-use-absolute-path-to-import-custom-scss-when-using-react-webpack
            loader:"sass-loader",
            options: {
                includePaths: [
                    // stylePath
                    basepath
                ],
            }
        }    
    ]
});

// # clean dist directory
// config.plugins.push(
//     new CleanWebpackPlugin(distPath, { 
//         root: basepath,
//         verbose: true, 
//         dry: false
//     })
// );

// #after build handler 
// config.plugins.push(
//     new WebpackOnBuildPlugin(function (stats) {
//         _writeConfigFile();
//         _writeVersionFile();
//         _copyData();
//         _copyExternals();
//         _copyImages();
//         _copyIcons();
//     })
// );

// # bundle analysis
// config.plugins.push(
//     new BundleAnalyzerPlugin({ analyzerMode: 'static' })
// );


config.plugins.push(
    new MiniCssExtractPlugin({
        filename: "chunks/[name].[contenthash:8].css",
        chunkFilename: "chunks/[name].[contenthash:8].css"
    })
);


// # index.html 
// const indexHtmlPath = buildConfig.indexHtmlPath || "./src/index.html";
const indexHtmlPath = "./src/index.html";
config.plugins.push(
    new HtmlWebPackPlugin({
        template: indexHtmlPath,
        filename: "./index.html"
    })
);


// # append external assets to index.html
// const externalAssets = buildConfig.externals .prod;
// config.plugins.push(
//     new HtmlWebpackTagsPlugin({
//         tags: externalAssets,
//         append: false,
//         // hash: true,
//         hash: function (path, hash) { return path + '?' + hash; }
//     })
// );

// # progress bar 
config.plugins.push(
    new ProgressBarPlugin({
        format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
    })
);





const compiler = webpack(config);


// https://medium.com/@artempetrovcode/how-webpack-progressplugin-works-7e7301a3d919


// # progress plugin
// const progressPlugin = new webpack.ProgressPlugin({
//     activeModules: false,
//     entries: true,
//     // handler(percentage, message, ...args) {
//     //   // custom logic
//     // },
//     modules: true,
//     modulesCount: 5000,
//     profile: false,
//     dependencies: true,
//     dependenciesCount: 10000,
//     percentBy: null
// });
// const progressPlugin = new webpack.ProgressPlugin((percentage, message) => {
//     console.log(`${(percentage * 100).toFixed()}% ${message}`);
// });
// const progressPlugin = new webpack.ProgressPlugin(function (percentage, msg, current, active, modulepath) {
//     if (process.stdout.isTTY && percentage < 1) {
//         process.stdout.cursorTo(0);
//         modulepath = modulepath ? ' …' + modulepath.substr(modulepath.length - 30) : '';
//         current = current ? ' ' + current : '';
//         active = active ? ' ' + active : '';
//         process.stdout.write((percentage * 100).toFixed(0) + '% ' + msg + current + active + modulepath + ' ');
//         process.stdout.clearLine(1);
//     } else if (percentage === 1) {
//         process.stdout.write('\n');
//         console.log('webpack: done.');
//     }
// });
// compiler.apply(progressPlugin);



compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
        // Handle errors here
        let msg = `\n ${chalk.red("[ERROR]")} ${chalk.gray("Webpack build error")} \n`;
        console.log(msg);
        console.log(err);
        // const msg = stats.toString({
        //     // Add console colors
        //     colors: true
        // });
        // console.log(msg);
        return;
    }

    // ##REF https://webpack.js.org/configuration/stats/
    const report = stats.toString({
        // Add console colors
        colors: true,
        // ##TODO capire altre optioni
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    });
    console.log(report);

    let msg = `\n ${chalk.cyan("[INFO]")} ${chalk.gray("Webpack build done")} \n`;
    console.log(msg);

});

