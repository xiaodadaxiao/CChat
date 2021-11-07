# 说明

CChat ，基于js的移动端网页即时聊天系统，技术栈：vue+socket.io+koa+mysql

实现了聊天的基本功能，包括：

- 用户邮箱注册（使用微软邮箱outlook进行验证码校验）
- 好友添加、备注、删除、黑名单
- 群聊的创建、邀请多个、单个好友加入群聊、群聊的管理
- 聊天信息发送，包括文本、图片、以及接入百度地图定位

前端：vue2全家桶+axios+vant+vue-socket.io

后端：koa2+mysql2+socket.io



# 展示

![](https://z3.ax1x.com/2021/11/07/IlvBkR.png)

![](https://z3.ax1x.com/2021/11/07/IlvxNn.png)

![](https://z3.ax1x.com/2021/11/07/IlxPjU.png)

# 使用

## 说明

项目分为两个部分：【前端根目录】cchat_vue_mobile  【后端根目录】cchat_koa_server

其中cchat_koa_server的cchat.sql为mysql的资源文件，需要导入到mysql中使用。

## 前端配置

### 1、  目录

进入前端文件夹根目录cchat_vue_mobile

### 2、配置服务器url

.env.development文件下的  VUE_APP_BASE_URL	='http://localhost:3000'为开发环境后台url

.env.productin文件下的 VUE_APP_BASE_URL='http://localhost:3000'为生产环境后台url

### 3、运行

执行命令 

npm install

npm run serve 

## 后端配置

### 1、  目录

进入前端文件夹根目录cchat_koa_server

### 2、env文件

根目录创建.env文件，设置项目私密信息

包括以下项：

.env

```js
APP_HOST=服务器要运行的地址（本地的话localhost）
APP_PORT=服务器要监听的端口
CLIENT=客户端的部署地址（用于设置跨域和图片访问限制）
MYSQL_HOST=mysql地址（本地的话localhost）
MYSQL_PORT= mysql端口 
MYSQL_USER=mysql账号
MYSQL_PASSWORD=mysql密码
MYSQL_DATABASE=连接的数据库名称

EMAIL_ADDRESS=你的outlook邮箱地址（用于发送验证码）
EMAIL_PASSWORD=你的outlook邮箱密码
```

例子： 

```js
APP_HOST=http://192.168.0.101
APP_PORT= 3000 
CLIENT=http://192.168.8.101:8080
MYSQL_HOST= localhost
MYSQL_PORT= 3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=cchat

EMAIL_ADDRESS=cchat@outlook.com
EMAIL_PASSWORD=123456
```

### 3、公钥和私钥

补充 rsa  公、私钥用以签名。在 ./config/keys 文件夹下，需要补充文件 ”public.key“ 和"private.key" ，内容为rsa公私钥

生成地址：http://www.metools.info/code/c80.html

### 4、运行

执行命令

npm install

npm run server