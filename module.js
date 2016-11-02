// test: node module.js sample/index.html

require('shelljs/global');
var path = require('path')

var html = process.argv[2];

// <script src="module/lib/include.js" data-module="app"></script>
var match = cat(html).match(/data-module=\"(.+)\"/);
if (!match) {
    exit(1);
}

var module = match[1];

if (!module.match(/\.js$/)) {
    module = module + '/' + module + '.js';
}

var filepath = path.dirname(html) + '/module/' + module;

echo(filepath);

