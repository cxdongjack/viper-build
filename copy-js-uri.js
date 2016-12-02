// test: node copy-js-uri.js dist sample/index.html sample/module/app/app.js

require('shelljs/global');
var fs =require('fs');
var path =require('path');
var asset = require('./util/asset.js');

var dist = process.argv[2];
var source = path.dirname(process.argv[3]);
var filepath = process.argv[4];
var cnt = cat(filepath);

function replaceUri(cnt) {
    var localURIReg = /([lL]ocalURI.*?)(['"].+?['"])/g;
    return cnt.replace(localURIReg, function(match, name, url) {
        url = url.replace(/'|"/g, '');
        url = source + '/' + url
        var img = asset(url) + path.extname(url);
        cp(url, dist + '/' + img);
        return `${name}'${img}'`;
    });
}

cnt = replaceUri(cnt, source);

echo(cnt);
