var crypto = require('crypto');

function setMD5(data) {
    const md5 = crypto.createHash('md5').update(data, 'utf-8').digest('hex');
    return md5;
}
module.exports = { setMD5 }