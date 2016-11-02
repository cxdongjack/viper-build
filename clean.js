require('shelljs/global');

var path = process.argv[2];

rm('-rf', path);
mkdir(path);


