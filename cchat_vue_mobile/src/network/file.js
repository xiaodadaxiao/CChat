import request from './request';

//上传聊天图片
export function uploadImage(formData) {
  return request({
    url: '/upload/image',
    headers: { 'Content-type': 'multipart/form-data' },
    method: 'post',
    data: formData,
  });
}
//上传用户头像
export function uploadAvatar(formData) {
  return request({
    url: '/upload/avatar',
    headers: { 'Content-type': 'multipart/form-data' },
    method: 'post',
    data: formData,
  });
}
