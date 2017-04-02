// test: node build.js sample/index.html dist [debug]
var path = require('path');
var sh = require('shelljs');
sh.config.silent = true;
sh.config.fatal = true;
var asset = require('./util/asset.js');

function run(task, args) {
    isDebug && echo('>> task: ', task);
    var cmd = task;
    if (cmd.charAt(0) != '.') {
        cmd = 'node ' + __dirname + '/' + task + '.js';
    }
    cmd = cmd + ' ' + (args || '');
    isDebug && echo('>> cmd: ', cmd);
    var ret = exec(cmd);
    isDebug && echo('>> ret: ', ret.substr(0, 100), '\n------\n');
    return ret;
}

// global
require('shelljs/global');

// task: module
var entry = process.argv[2];
var dist = process.argv[3];
var isDebug = process.argv[4];
var moduleName = path.parse(entry).name;
var modulePath = run('module', entry);

// task: parse
var filesStr = run('parse', modulePath);
var files = JSON.parse(filesStr);

// task: build-css
var cssFiles = files.filter(function(file) {
    return file.match(/\.css$/);
});
// dist/index.css
var cssTarget = dist + '/' + moduleName + '.css';
run('build-css',  cssFiles.join(' ')).to(cssTarget);

// copy imgs
run('copy-css-img', cssTarget).to(cssTarget);

// task: build-js
var jsFiles = files.filter(function(file) {
    return file.match(/\.js$/);
});
var jsTarget = dist + '/' + moduleName + '.js';
run('build-js',  jsFiles.join(' ')).to(jsTarget);

// copy js uri
run('copy-js-uri', [dist, entry, jsTarget].join(' ')).to(jsTarget);

// task: min-css
var cssMinTarget = dist + '/' + moduleName + '.min.css';
run('./node_modules/.bin/cleancss', cssTarget).to(cssMinTarget);
var cssMinHashTarget = dist + '/' + asset(cssMinTarget) + '.css';
mv(cssMinTarget, cssMinHashTarget);

// task: min-js
// uglifyjs $js_list -m -c "pure_getters=true,pure_funcs=['Date.now','Math.random']" -b "beautify=false,ascii-only=true" -e "window:window,undefined" --screw-ie8 --source-map /tmp/build.js.map 2>/dev/null | sed '$d' > $2
var jsMinTarget = dist + '/' + moduleName + '.min.js';
var uglifyjsArgs = ' -m -c "pure_getters=true,pure_funcs=[\'Date.now\',\'Math.random\']" -b "beautify=false,ascii-only=true" -e "window:window,undefined" --screw-ie8 --source-map /tmp/build.js.map 2>/dev/null';
run('./node_modules/.bin/uglifyjs', jsTarget + uglifyjsArgs).to(jsMinTarget);
var jsMinHash= asset(jsMinTarget);
var jsMinHashTarget = dist + '/' + jsMinHash + '.js';
mv(jsMinTarget, jsMinHashTarget);

// task:
var htmlTarget = dist + '/' + moduleName + '.html';
run('update-html', entry + ' ' + jsMinHashTarget + ' ' + cssMinHashTarget).to(htmlTarget);

// backup the sourcemap and raw
var rawTarget = dist + '/' + jsMinHash + '.raw';
cp(jsTarget, rawTarget);
var mapTarget = dist + '/' + jsMinHash  + '.map';
mv('/tmp/build.js.map', mapTarget);

// task: generate .json
var distPkg = {
    moduleName : moduleName,
    html : htmlTarget,
    js : jsTarget,
    css : cssTarget,
    minjs : jsMinHashTarget,
    mincss : cssMinHashTarget,
    map: mapTarget,
    raw: rawTarget
};
echo(JSON.stringify(distPkg, 1, 2));

// clean
//if (!isDebug) {
    //rm(distPkg.js, distPkg.css);
//}
