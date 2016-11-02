// test: node build-css.js sample/module/module-a/a.css

require('shelljs/global');
var path =require('path');
var fs =require('fs');

// var target = process.argv[2];
// var prefix = path.basename(target);
var files = process.argv.slice(2);

var CWD = pwd();

var cssCnt = files.map(function(filepath) {
    var cnt = fs.readFileSync(path.normalize(filepath), 'utf8');
    return replaceUrlInCSS(cnt, filepath, CWD);
}).join('\n\n').replace(/@import.*?\n/g, '');


function replaceUrlInCSS(cnt, filepath, cwd) {
    return cnt.replace(/url\((.+?)\)/g, function(match, url) {
      url = url.replace(/'|"/g, '');
      if (!/^http/.test(url)) {
        url = redirectUrl(filepath, url, cwd);
      }
      return 'url(' + url + ')';
    });
}

function redirectUrl(filepath, url, base) {
    var absUrl = path.dirname(filepath) + '/' + url;
    return absUrl.replace(base, '');
}

echo(cssCnt);