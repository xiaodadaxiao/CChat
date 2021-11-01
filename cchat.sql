#创建用户表
CREATE TABLE IF NOT EXISTS `user`  (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(30)  ,
  `email` VARCHAR(50)  NOT NULL UNIQUE,
  `cid` VARCHAR(20)  NOT NULL UNIQUE,
  `password` VARCHAR(50)  NOT NULL,
  `avatar_url` VARCHAR(200) ,
  `signature` VARCHAR(200) ,
  `state` INT DEFAULT 0,
  `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

# 创建注册表register
CREATE TABLE IF NOT EXISTS `register` (
   `id` INT PRIMARY KEY AUTO_INCREMENT, 
   `email` VARCHAR(50)  NOT NULL ,
   `code` VARCHAR(30) NOT NULL, 
   `end_time` TIMESTAMP NOT NULL, 
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ); 


#创建号码表cid
CREATE TABLE IF NOT EXISTS `cid` (
   `id` INT PRIMARY KEY AUTO_INCREMENT, 
   `cid` VARCHAR(20)  NOT NULL ,
   `state` INT DEFAULT 0 , 
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  #创建好友申请表
  CREATE TABLE IF NOT EXISTS `friend_apply` (
   `id` INT PRIMARY KEY AUTO_INCREMENT,  
   `user_cid` VARCHAR(20) NOT NULL, 
    `friend_cid` VARCHAR(20) NOT NULL, 
    `message` VARCHAR(50),
    `state` INT DEFAULT 0,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   FOREIGN KEY (`user_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`friend_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE
  ); 

  #创建好友表
CREATE TABLE IF NOT EXISTS `friend` (
   `id` INT PRIMARY KEY AUTO_INCREMENT,  
   `apply_id` INT NOT NULL ,
   `user_cid` VARCHAR(20) NOT NULL, 
    `friend_cid` VARCHAR(20) NOT NULL, 
    `nickname` VARCHAR(20) NOT NULL ,
    `last_time` TIMESTAMP,
    `state` INT DEFAULT 0,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   FOREIGN KEY (`user_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`friend_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`apply_id`) REFERENCES `friend_apply`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ); 
  #(补充删除信息时间)ALTER TABLE `friend` ADD  `delete_time`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  #(修改 最后聊天时间) ALTER TABLE friend MODIFY last_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  #创建群号码表
CREATE TABLE IF NOT EXISTS `gid` (
   `id` INT PRIMARY KEY AUTO_INCREMENT, 
   `gid` VARCHAR(20)  NOT NULL ,
   `state` INT DEFAULT 0 , 
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

  #创建群group表
CREATE TABLE IF NOT EXISTS `group`  (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `gid` VARCHAR(20)  NOT NULL UNIQUE,
  `gname` VARCHAR(30)  ,
  `notice` VARCHAR(200) ,
  `state` INT DEFAULT 0,
  `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
#（补充添加群主项）
ALTER TABLE `group` ADD CONSTRAINT fk_leader_cid FOREIGN KEY(leader_cid) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE;

 #创建群成员表
  CREATE TABLE IF NOT EXISTS `group_user` (
   `id` INT PRIMARY KEY AUTO_INCREMENT,  
   `cid` VARCHAR(20) NOT NULL, 
    `gid` VARCHAR(20) NOT NULL, 
    `nickname` VARCHAR(20),
    `state` INT DEFAULT 0,
     `role` INT DEFAULT 0,
     `remind` BOOLEAN DEFAULT TRUE,
      `last_time` TIMESTAMP,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   FOREIGN KEY (`cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`gid`) REFERENCES `group`(`gid`) ON DELETE CASCADE ON UPDATE CASCADE
  ); 
  #(补充删除信息时间)ALTER TABLE group_user ADD  `delete_time`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 
    #创建好友聊天信息表
  CREATE TABLE IF NOT EXISTS `friend_message` (
   `id` INT PRIMARY KEY AUTO_INCREMENT,  
   `talker_cid` VARCHAR(20) NOT NULL, 
    `listener_cid` VARCHAR(20) , 
    `content` TEXT NOT NULL, 
    `type` INT NOT NULL,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   FOREIGN KEY (`talker_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`listener_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE
  );
  #创建群聊天信息表
  CREATE TABLE IF NOT EXISTS `group_message` (
   `id` INT PRIMARY KEY AUTO_INCREMENT,  
   `talker_cid` VARCHAR(20) NOT NULL, 
    `listener_gid` VARCHAR(20) ,
    `content` TEXT NOT NULL, 
    `type` INT NOT NULL,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   FOREIGN KEY (`talker_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`listener_gid`) REFERENCES `group`(`gid`) ON DELETE CASCADE ON UPDATE CASCADE
  ); 
  
  #创建群申请表
  CREATE TABLE IF NOT EXISTS `group_apply` (
   `id` INT PRIMARY KEY AUTO_INCREMENT,  
   `inviter_cid` VARCHAR(20) NOT NULL, 
    `invitee_cid` VARCHAR(20) NOT NULL, 
    `gid` VARCHAR(20) NOT NULL, 
    `state` INT DEFAULT 0,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   FOREIGN KEY (`inviter_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`invitee_cid`) REFERENCES USER(`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`gid`) REFERENCES `group`(`gid`) ON DELETE CASCADE ON UPDATE CASCADE
  ); 
  
  #创建文件上传表
  CREATE TABLE IF NOT EXISTS upload (
   `id` INT PRIMARY KEY AUTO_INCREMENT, 
   `user_cid` VARCHAR(20)   ,
   `type` INT  , 
   `filename` VARCHAR(300),
   `mimetype` VARCHAR(30),
   `size` INT,
   `createAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `updateAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (`user_cid`) REFERENCES USER(`cid`) ON DELETE SET NULL ON UPDATE CASCADE
  );
