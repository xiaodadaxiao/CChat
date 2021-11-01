const connection = require('../app/database');

class FileService {
  async saveImage(userCid, type, filename, mimetype, size) {
    const statement = `INSERT INTO upload (user_cid,type,filename,mimetype,size) VALUES (?,?,?,?,?);`;
    const [result] = await connection.execute(statement, [userCid, type, filename, mimetype, size]);
    return result;
  }
  //得到图片
  async getImage(filename, type) {
    const statement = `SELECT * FROM upload WHERE filename=? AND type=?;`;
    const [result] = await connection.execute(statement, [filename, type]);
    return result;
  }
}

module.exports = new FileService();
