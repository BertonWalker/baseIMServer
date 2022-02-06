class MsgLite {
    code = 0;
    clientNumber = 0;
    constructor(clientNumber) {
        this.clientNumber = clientNumber;
    }
}

class AuthResp extends MsgLite{
    constructor(clientNumber, code) {
        super(clientNumber);
        if (Number.isInteger(code)) {
            this.code = code;
        }
    }
}
class FriendListResp extends MsgLite{
    data = [];
    constructor(clientNumber, list) {
        super(clientNumber);
        this.data = list;
    }
}
class TextResp extends MsgLite{

    constructor(clientNumber) {
        super(clientNumber);
    }
}

module.exports = {
    AuthResp,
    TextResp,
    FriendListResp,
}