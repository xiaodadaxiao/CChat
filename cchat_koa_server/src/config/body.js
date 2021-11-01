koaBodyConfig = {
  // 支持文件格式
  multipart: true,
  formidable: {
    // 上传目录
    uploadDir: path.join(__dirname, 'public/uploads'),
    // 保留文件扩展名
    keepExtensions: true,
  },
};
module.exports = { koaBodyConfig };
