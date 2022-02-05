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

module.exports = {
    AuthResp,
}