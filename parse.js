// test: node parse.js sample/module/app/app.js

require('shelljs/global');
var parser = require('./util/parser.js');

var all = process.argv[2];

echo(JSON.stringify(parser.parseRecursive(all)));

