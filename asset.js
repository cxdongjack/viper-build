var fs = require('fs');
var crypto = require('crypto');

/* 翻译自以下算法
BASE64_DIGITS=`echo {0..9} {a..z} {A..Z} @ _ | sed 's/ //g'`
asset() {
    echo `md5sum $1 | awk 'BEGIN {BASE64_DIGITS = "'"$BASE64_DIGITS"'"} {octal=sprintf("%016o", strtonum("0x" substr($1, 11, 12))); for (i = 1; i <= 16; i += 2) {printf substr(BASE64_DIGITS, strtonum("0" substr(octal, i, 2)) + 1, 1)}}'`
}
*/
var BASE64_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@_';
function base64(md5) {
    var base64, section, octal, i, index;
    base64 = '';
    // 取第10位起，取12位
    section = md5.substr(10, 12);
    // 先转成10进制，再转成8进制
    octal = parseInt(section, 16).toString(8);
    // 循环，每次取2位（8*8 = 64），并转成10进制
    for (i = 0;i < 16;i = i + 2) {
        index = parseInt(octal.substr(i, 2), 8)
        base64 += BASE64_DIGITS[index];
    }
    return base64;
}

function md5(path){
    var cnt = fs.readFileSync(path);
    var md5 = crypto.createHash('md5');
    md5.update(cnt, 'utf8');
    return md5.digest('hex');
}

function asset(path) {
    return base64(md5(path));
}

// exports
module.exports = asset;
exports.md5 = md5;
exports.base64 = base64;

if (require.main === module) {
    var filepath = process.argv[2];
    console.log(asset(filepath));
}

