// test: node copy-css-img.js dist/index.css

require('shelljs/global');
var path = require('path');
var fs = require('fs');
var asset = require('./util/asset.js');

var target = process.argv[2];
var dirname = path.dirname(target);

var cnt = cat(target);


function replaceUrlInCSS(cnt, filepath, cwd) {
    return cnt.replace(/url\((.+?)\)/g, function(match, url) {
      url = url.replace(/'|"/g, '');
      if (!/^http/.test(url)) {
          var img = asset(url) + path.extname(url);
          cp(url, dirname + '/' + img);
          url = img;
      }
      return 'url(' + url + ')';
    });
}

echo(replaceUrlInCSS(cnt))
