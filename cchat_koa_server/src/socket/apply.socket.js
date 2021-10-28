const Users = require('./users');

const friendService = require('../service/friend.service');
const groupService = require('../service/group.service');
//好友申请
async function friendApply(socket, data, cb) {
  const { fromCid, toCid } = data;
  //查看是否在线
  if (!Users.get(toCid)) return;
  //查看请求信息
  const [applyInfo] = await friendService.getApplyByUserAndFriend(fromCid, toCid);
  if (!applyInfo) return;
  socket.to(Users.get(toCid)).emit('friendApply');
}
//群申请
async function groupApply(socket, data, cb) {
  const gid = data.gid;
  //得到群信息
  const [groupInfo] = await groupService.getGroupByGid(gid);
  if (!groupInfo) return;
  const leaderCid = groupInfo.leader_cid;

  if (!Users.get(leaderCid)) return;
  socket.to(Users.get(leaderCid)).emit('groupApply');
}

module.exports = { friendApply, groupApply };
