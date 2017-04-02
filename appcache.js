#!/usr/bin/env node
// test: node appcache.js dist index viper-build

require('shelljs/global');
var path =require('path');
var fs =require('fs');
var tmpl =require('./util/tmpl.js');

var dist = process.argv[2];
var moduleName = process.argv[3];
var project = process.argv[4];
var ignoreFiles = ['html', 'css', 'js'].map(function(affix) {
    return moduleName + '.' + affix;
});

var files = ls(dist);
// 过滤掉ignore文件
var finalFiles = files.filter(function(file) {
    return ignoreFiles.indexOf(file) === -1 && !/\.(map|raw)$/.test(file);
});

// 拼接cache.appcache
var cnt =
`CACHE MANIFEST
`;

project && (cnt +=
`# @begin[${project}]
`);

cnt += finalFiles.join('\n');

project && (cnt += `
# @end
`);


cnt += `

NETWORK:
*`;

echo(cnt);
