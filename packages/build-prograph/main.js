var path = require('path');
var fs = require('fs');

function onBeforeBuildFinish(options, callback) {

    Editor.log("onBeforeBuildFinish / options", options);
    Editor.log("onBeforeBuildFinish / options.dest", options.dest);
    Editor.log("onBeforeBuildFinish / options.actualPlatform", options.actualPlatform);

    const wini_dir = path.join(options.project, 'packages', 'build-wini' , 'before-build-finish');

    if (options.actualPlatform === "web-mobile") {

        const wini_files = path.join(wini_dir , 'web-mobile');
        copyFiles(options , wini_files);
    }
    else if (options.actualPlatform === "web-desktop") {
        const wini_files = path.join(wini_dir , 'web-desktop');
        copyFiles(options , wini_files);
        // var script = fs.readFileSync(mainJsPath, 'utf8');     // read main.js
        // script += '\n' + 'window.myID = "01234567";';         // append any scripts as you need
        // fs.writeFileSync(mainJsPath, script);                 // save main.js
    }
    else if (options.actualPlatform === "fb-instant-games") {
        const wini_files = path.join(wini_dir , 'fb-instant-games');
        copyFiles(options , wini_files);
        // Editor.log(`${fileNameArray} depends on: ${options.actualPlatform || options.dest} (${options})`);
    }

    callback();
}

function onBuildFinish(options, callback) {

    Editor.log("onBuildFinish / options", options);
    Editor.log("onBuildFinish / options.dest", options.dest);
    Editor.log("onBuildFinish / options.actualPlatform", options.actualPlatform);

    const wini_dir = path.join(options.project, 'packages', 'build-wini' , 'build-finish');
   
    if (options.actualPlatform === "web-mobile") {
        const wini_files = path.join(wini_dir , 'web-mobile');
        copyFiles(options , wini_files);
    }
    else if (options.actualPlatform === "web-desktop") {
        const wini_files = path.join(wini_dir , 'web-desktop');
        copyFiles(options , wini_files);
        // var script = fs.readFileSync(mainJsPath, 'utf8');     // read main.js
        // script += '\n' + 'window.myID = "01234567";';         // append any scripts as you need
        // fs.writeFileSync(mainJsPath, script);                 // save main.js
    }
    else if (options.actualPlatform === "fb-instant-games") {
        const wini_files = path.join(wini_dir , 'fb-instant-games');
        copyFiles(options , wini_files);
        // Editor.log(`${fileNameArray} depends on: ${options.actualPlatform || options.dest} (${options})`);
    }

    callback();
}

function copyFiles(options , wini_files){
    fs.readdir(wini_files, (err, files) => {
        files.forEach(file => {
            Editor.log('file : ', file);
            var file_scr = path.join(wini_files , file);  // get path of file in wini_files
            var file_dest = path.join(options.dest, file);  // get dest of file to build

            fs.copyFile(file_scr, file_dest, 0, function (err) {  // copy file in build folder
                if (err)
                    Editor.log(file, "Error Found:", err);
                else
                    Editor.log(file, "file copy done");
            });
        });
    });
}

module.exports = {
    load() {
        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
        Editor.Builder.on('build-finished', onBuildFinish);
    },

    unload() {
        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
        Editor.Builder.removeListener('build-finished', onBuildFinish);
    }
};
