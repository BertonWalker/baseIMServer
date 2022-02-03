const mongoDB = require('mongodb');
const { url } = require('../config');
const { logger } = require('../lib/logger');

class DB {
    url = url;
    db = null;
    constructor() {
        this.connect();
    }
    async connect() {
        const client = await mongoDB.MongoClient.connect(url);
        const db = client.db();
        this.db = db;
    }

    async insertUser(username, password) {
        if(!username || !password) {
            return false;
        }
        const queryResult = await this.queryUser(username);
        if (queryResult && queryResult.length > 0) {
            logger.info('insert fail, username repeat');
            return Promise.reject(new Error('repeat user'));
        }
        const {acknowledged} = await this.db.collection('auth').insertOne({username, password});
        if (!acknowledged) {
            logger.info('insert fail', acknowledged);
            return Promise.reject(new Error('insert fail'));
        }
        return Promise.resolve();
    }
    async queryUser(username) {
        return this.db.collection('auth').find({username}).toArray()
    }

}

module.exports = {
    DB,
}