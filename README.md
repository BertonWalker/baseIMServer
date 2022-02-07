
#BaseIM


### 体验demo
[http://47.93.241.128/](http://47.93.241.128/)

---

此项目是个人创建，基于vue开发的IM项目

项目开始日期：2022年2月4日

---
技术栈：
1. typescript
1. vue3 setup
1. vuex
1. vue-router
1. elementUI
1. socket.io-client
1. axios


已实现功能：

1. 登陆、注册
2. 通过socket.io建立websocket连接到服务器
3. 发送文本消息至服务器
4. 在线消息通知和展示
5. 好友列表
6. 消息与接口回调机制

未来实现功能

1. 获取离线消息
2. 用户昵称头像设置
3. 基于mediasoup的p2p视频通话
4. UI美化
5. 好友关系（添加、删除、在线状态等）
6. 群聊

---

系统设计：

1. 消息回调和超时机制（/src/sdk/IM.ts: IM.send()）
   1. 发送消息时，携带一个clientNumber作为标记，一般为自增
   2. 设置定时器，超时后执行失败回调，并清除Map中的缓存
   3. 以clientNumber为key，存储resolve、reject以及timeout至Map中
   4. 将携带clientNumber的消息发送至server，处理完消息后返回成功消息，也携带clientNumber
   5. 根据server返回的clientNumber即可从Map中找到对应回调并执行，完成一次完整的Promise

2. 离线消息同步（待实现）
