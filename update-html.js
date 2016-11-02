// test: node update-html.js sample/index.html

require('shelljs/global');
var path =require('path');
var fs =require('fs');

var html = process.argv.slice(2);

// <script src="module/lib/include.js" data-module="app"></script>
var tpl = '<link rel="stylesheet" href="{css}">' +
          '<script src="{js}"><\/script>';

// 清理掉include
cnt = cat(html).replace(/<script.*?data-module.*?><\/script>/, tpl);

echo(cnt);
