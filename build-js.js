// test: node build-js.js sample/module/app/app.js

require('shelljs/global');
var path =require('path');
var fs =require('fs');

// var target = process.argv[2];
// var prefix = path.basename(target);
var files = process.argv.slice(2);

var prepend = __dirname + '/util/prepend.js';
var cnt = cat(prepend, files);

// 清理掉include
cnt = cnt.replace(/include\s*\([\s\S]+?\);?/g, '');

echo(cnt);
