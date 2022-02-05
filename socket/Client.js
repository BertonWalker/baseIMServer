const { logger } = require('./socket-logger');
const { AuthResp } = require('./MsgLite');


const onConnect = (socket) => {
    const clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    new Client(clientIp, socket);
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
            const authResp = new AuthResp(authMsg.clientNumber);
            this.resp(authResp);
        } else {
            const authResp = new AuthResp(authMsg.clientNumber, 2001);
            this.resp(authResp);
        }
    }


}




const handleProcessContentMsg = () => {

}

module.exports = {
    onConnect
}