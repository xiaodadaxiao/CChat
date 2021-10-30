/* 群状态常量 */
export const NORMAL = 0; //正常
export const BANTALK = 1; //禁言

/* 群用户状态常量 */
export const USER_NORMAL = 0; //正常
export const USER_BANTALK = 1; //禁言
/* 群用户角色常量 */
export const USER_ROLE_NORMAL = 0; //正常
export const USER_ROLE_LEADER = 1; //群主
/* 群申请状态常量 */
export const APPLY_WAITING = 0; //等待中
export const APPLY_ACCEPTED = 1; //已接受
export const APPLY_REJECTED = 2; //已拒绝
export const APPLY_BLACKLIST = 3; //黑名单

/* 用户与群关系 */
export const RELATION_STRANGER = 'STRANGER'; //陌生人
export const RELATION_JOIN = 'JOIN'; //已加入
export const RELATION_LEADER = 'LEADER'; //群主
/* 用户的群接收状态 */

export const REMIND_NORMAL = 1; //正常（true）
export const REMIND_NOT_DISTURB = 0; //免打扰
