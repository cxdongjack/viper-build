require('shelljs/global');
var file = require('./util/file.js');

var pkgPath = process.argv[2] || './package.json';

var pkg = file.readJSON(pkgPath);

var config = pkg['build'] || {};

config.source = config.source || 'src';

config.dist = config.dist || 'dist';

config.entry = config.entry || ls(config.source + '/*.html');
// 特殊逻辑，过滤掉test.html
config.entry = config.entry.filter(function(path) {
    return !/test\.html/.test(path);
});

echo(JSON.stringify(config, 1, 2));

