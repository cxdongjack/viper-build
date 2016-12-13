#!/usr/bin/env node

var path = require('path');
var sh = require('shelljs');
var asset = require('./util/asset.js');
var silentState = sh.config.silent; // save old silent state
sh.config.silent = true;

function run(task, args) {
    echo('>> task: ', task);
    var cmd = task;
    if (cmd.charAt(0) != '.') {
        cmd = 'node ' + __dirname + '/' + task + '.js';
    }
    cmd = cmd + ' ' + (args || '');
    echo('>> cmd: ', cmd);
    var ret = exec(cmd);
    echo('>> ret: ', ret.substr(0, 200), '\n------\n');
    return ret;
}

// global
require('shelljs/global');
var isDebug = process.argv[2];

// task: config
var configStr = run('config');
config = JSON.parse(configStr);

// task: clean
run('clean', config.dist);

// task: module
config.entry.forEach(function(entry) {
    var distStr = run('build', entry + ' ' + config.dist);
    var dist = JSON.parse(distStr);
    // 特殊逻辑
    if (config.entry.length == 1) {
        var dist = JSON.parse(distStr);
        run('appcache', config.dist + ' ' + dist.moduleName + ' ' + config.project)
            .to(config.dist + '/cache.appcache');
    }
});
