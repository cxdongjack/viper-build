#!/usr/bin/env node
//test: node build-umd.js sample/module/app/app.js ttt.js
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
if (process.argv.length < 4) {
    return echo('viper-build-umd app.js dist.js');
}
var entry = process.argv[2];
var dist = process.argv[3];
var isDebug = 1;

// task: parse
var filesStr = run('parse', entry);
var files = JSON.parse(filesStr);

// task: build-js
var jsFiles = files.filter(function(file) {
    return file.match(/\.js$/);
});
var jsTarget = dist;
run('build-js',  jsFiles.join(' ')).to(jsTarget);

// task: min-js
var jsMinTarget = dist;
var uglifyjsArgs = ' -e "window:window,undefined" --screw-ie8 -c -b "beautify=true,ascii-only=true" 2>/dev/null';
run('./node_modules/.bin/uglifyjs', jsTarget + uglifyjsArgs).to(jsMinTarget);

