// 仅合并，不压缩
//test: node build-raw.js sample/module/app/app.js dist raw sample/index.html
var path = require('path');
var sh = require('shelljs');
sh.config.silent = true;
var asset = require('./util/asset.js');

function run(task, args) {
    isDebug && echo('>> task: ', task);
    var cmd = task;
    if (cmd.charAt(0) != '.') {
        cmd = 'node ' + __dirname + '/' + task + '.js';
    }
    cmd = cmd + ' ' + (args || '');
    isDebug && echo('>> cmd: ', cmd);
    var ret = exec(cmd);
    isDebug && echo('>> ret: ', ret.substr(0, 100), '\n------\n');
    return ret;
}

// global
require('shelljs/global');

// task: module
var entry = process.argv[2];
var dist = process.argv[3];
var moduleName = process.argv[4];
var index_html = process.argv[5];
var isDebug = 1;

// task: parse
var filesStr = run('parse', entry);
var files = JSON.parse(filesStr);

mkdir('-p', dist);

// task: build-css
var cssFiles = files.filter(function(file) {
    return file.match(/\.css$/);
});
// dist/index.css
var cssTarget = dist + '/' + moduleName + '.css';
run('build-css',  cssFiles.join(' ')).to(cssTarget);

// copy imgs
run('copy-css-img', cssTarget).to(cssTarget);

// task: build-js
var jsFiles = files.filter(function(file) {
    return file.match(/\.js$/);
});
var jsTarget = dist + '/' + moduleName + '.js';
run('build-js',  jsFiles.join(' ')).to(jsTarget);

// copy js uri
if (index_html) {
    run('copy-js-uri', [dist, index_html, jsTarget].join(' ')).to(jsTarget);
}

// 闭包一下
echo('(function() {\n' + cat(jsTarget) + '\n})();').to(jsTarget);
