const { logger } = require('./socket-logger');
const { AuthResp, TextResp } = require('./MsgLite');
const {DB} = require('../lib/database');
const dbClient = new DB();

const userCache = new Map();

const onConnect = (socket) => {
    const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    new Client(clientIp, socket);
}

const checkEmpty = (...args) => {
    return args.every((target) => {
        if (target === undefined || target === null || Number.isNaN(target)) {
            return false
        } else {
            return true;
        }
    })
}

class Client {
    constructor(ip, socket) {
        this.ip = ip;
        this.socket = socket;
        this.id = socket.id;
        socket.on('message', this.onMessage.bind(this))
        socket.on('disconnect', this.onDisconnect.bind(this))
        socket.on('error', this.onError.bind(this))
    }
    onMessage(content) {
        logger.info(`[${this.id}] recv a client msg: ${content}`);
        try {
            const msg = JSON.parse(content);
            switch (msg.type) {
                case 1: // Auth 鉴权消息
                    this.processAuthMsg(msg);
                    break;
                case 2:
                    this.processTextMsg(msg);
                    break;
            }
        } catch (e) {
            console.log(e);
            logger.warn(`${this.socket.id} recv a wrong msg`);
        }
    }
    onDisconnect() {

    }
    onError(reason) {
        logger.error(`[${this.id}] client error, reason: `, reason)
    }

    send(MsgLite) {
        const str = JSON.stringify(MsgLite);
        logger.info(`[${this.id}] push to client: ${str}`);
        this.socket.send(str);
    }

    resp(MsgLite) {
        const str = JSON.stringify(MsgLite);
        logger.info(`[${this.id}] resp to client: ${str}`);
        this.socket.send(str);
    }

    async processAuthMsg(authMsg) {

        if (authMsg.token) { // TODO 校验token
            userCache.set(authMsg.userId, this);
            const authResp = new AuthResp(authMsg.clientNumber);
            this.resp(authResp);
        } else {
            const authResp = new AuthResp(authMsg.clientNumber, 2001);
            this.resp(authResp);
        }
    }
    async processTextMsg(textMsg) {
        const { type, clientNumber, userId, to, content, msgId } = textMsg;
        if (!checkEmpty(type, clientNumber, userId, to, content, msgId)) {
            logger.error('Msg has wrong');
            return;
        }

        const textResp = new TextResp(clientNumber);
        this.resp(textResp);
        const receiver = await dbClient.queryUser(to);
        const maxMsgVersion = receiver[0].maxMsgId
        const saveMsg = {
            msgVersion: maxMsgVersion + 1,
            type,
            msgSender: userId,
            msgReceiver: to,
            content,
        }

        await dbClient.insertMsg(saveMsg).catch((err) => {
            logger.error('insert msg fail', err);
        });
        await dbClient.increaseMaxMsgVersion(to);
        if (userCache.has(to)) {
            userCache.get(to).socket.send(JSON.stringify(saveMsg));
        }
    }


}


module.exports = {
    onConnect
}