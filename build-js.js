// test: node build-js.js sample/module/app/app.js

require('shelljs/global');
var path =require('path');
var fs =require('fs');
var tmpl =require('./util/tmpl.js');

// var target = process.argv[2];
// var prefix = path.basename(target);
var files = process.argv.slice(2);

var prepend = __dirname + '/util/prepend.js';
var cnt = cat(prepend, files);

// 清理掉include
cnt = comment(cnt, /include\s*\([\s\S]+?\);?/g);

// 清理掉develpment
cnt = comment(cnt, /\/\/@develpment([\s\S]+?)\/\/@end/g);

cnt = tmpl(cnt);

echo(cnt);


function comment(cnt, reg) {
    return cnt.replace(reg, function(match, name, url) {
        var lines = match.split('\n').map(function(line) {
            return '// ' + line;
        });
        return lines.join('\n');
    });
}
