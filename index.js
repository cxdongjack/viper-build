var path = require('path');
var sh = require('shelljs');
var silentState = sh.config.silent; // save old silent state
sh.config.silent = true;

function run(task, args) {
    echo('>> task: ', task);
    var cmd = 'node ' + __dirname + '/' + task + '.js ' + (args || '');
    echo('>> cmd: ', cmd);
    var ret = exec(cmd);
    echo('>> ret: ', ret);
    return ret;
}

// global
require('shelljs/global');

// task: config
var configStr = run('config');
config = JSON.parse(configStr);

// task: clean
run('clean', config.dist);

// 中间文件, 方便debug
configStr.to(config.dist + '/config.json');

// task: module
var entry = config.entry[0];
var modulePath = run('module', entry);

// task: parse
var filesStr = run('parse', modulePath);
var files = JSON.parse(filesStr);

// task: build-css
var cssFiles = files.filter(function(file) {
    return file.match(/\.css$/);
});
// dist/index.css
var cssTarget = config.dist + '/' + path.parse(entry).name + '.css';
run('build-css',  cssFiles.join(' ')).to(cssTarget);

// copy imgs
run('copy-css-img', cssTarget).to(cssTarget);

// task: build-js
var jsFiles = files.filter(function(file) {
    return file.match(/\.js$/);
});
var jsTarget = config.dist + '/' + path.parse(entry).name + '.js';
run('build-js',  jsFiles.join(' '));



// build-js
// var jsFiles = files.filter(function(file) {
//     return file.match(/\.js$/);
// })
// run('build-js', config.dist + ' ' + jsFiles.join(' '));
