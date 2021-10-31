const messageType = require('../constant/message.constant');
const friendType = require('../constant/friend.constant');
const memberType = require('../constant/member.constant');
const Users = require('./users');

const memberService = require('../service/member.service');
const messageService = require('../service/message.service');
const friendService = require('../service/friend.service');
//接收信息
async function onMessage(socket, data, cb) {
  const { content, chatId, chatType, type } = data;
  /* 发给好友 */
  if (chatType == messageType.CHAT_FRIEND) {
    //判断是否是好友[查询对方是否添加我]
    const [friendInfo] = await friendService.getFriendByCid(chatId, socket.cid);
    if (!friendInfo) return cb(null, '对方不是你的好友');
    if (friendInfo.state == friendType.BLACKLIST) return cb(null, '对方已将你拉入黑名单');
    //判断我是否拉黑好友
    const [myInfo] = await friendService.getFriendByCid(socket.cid, chatId);
    if (!myInfo) return cb(null, '对方不是你的好友');
    if (myInfo.state == friendType.BLACKLIST) return cb(null, '你已将对方拉黑，请先移出黑名单');
    //数据库保存聊天
    const result = await messageService.addFriendMessage(socket.cid, chatId, content, type);
    cb('发送成功');
    //发送
    const data = {
      content,
      listener_cid: chatId,
      talker_cid: socket.cid,
      type,
      updateAt: new Date(),
      id: result.insertId, //id
      avatar_url: socket.avatar_url,
    };
    //发给自己
    socket.emit('friendMessage', data);
    //判断是否在线
    if (!Users.get(chatId)) return;
    socket.to(Users.get(chatId)).emit('friendMessage', data);
  }
  /* 发给群 */
  if (chatType == messageType.CHAT_GROUP) {
    //查询发言者的成员信息
    const [memberInfo] = await memberService.getOneMember(chatId, socket.cid);
    if (!memberInfo) return cb(null, '你不在该群聊');
    if (memberInfo.state == memberType.USER_BANTALK) return cb(null, '你已被禁言');
    //数据库保存聊天信息
    const result = await messageService.addGroupMessage(socket.cid, chatId, content, type);
    cb('发送成功');
    const data = {
      id: result.insertId, //id
      chatId,
      gid: chatId, //gid
      talker_cid: socket.cid,
      avatar_url: socket.avatar_url,
      content,
      type,
      updateAt: new Date(),
      role: memberInfo.role,
      nickname: memberInfo.nickname,
    };
    //发到群上
    socket.to(chatId).emit('groupMessage', data);
    //发给自己
    socket.emit('groupMessage', data);
  }
}
//更改最后聊天时间
async function onLastTime(socket, data, cb) {
  const { chatType, chatId } = data;
  //更新好友最后聊天时间
  if (chatType == messageType.CHAT_FRIEND) {
    const result = await friendService.updateFriendByKeyValue(socket.cid, chatId, 'last_time', new Date());
  }
  //更新群聊后聊天时间
  if (chatType == messageType.CHAT_GROUP) {
    const result = await memberService.updateMemberByKeyValue(socket.cid, chatId, 'last_time', new Date());
  }
  cb('修改成功');
}

module.exports = { onMessage, onLastTime };
