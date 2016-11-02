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

// task: config
var configStr = run('config');
config = JSON.parse(configStr);

// task: clean
run('clean', config.dist);

// 中间文件, 方便debug
configStr.to(config.dist + '/config.json');

// task: module
config.entry.forEach(function(entry) {
    var json = run('build', entry + ' ' + config.dist);
    json = JSON.parse(json);
    run('update-html', json.html + ' ' + json.minjs + ' ' + json.mincss).to(json.html);
});
