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
        const client = await mongoDB.MongoClient.connect(this.url);
        this.db = client.db();
    }

    insertDB(collectionName, data) {
        if (Array.isArray(data)) {
            return this.db.collection(collectionName).insertMany(data);
        } else {
            return this.db.collection(collectionName).insertOne(data);
        }
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
        const insertStr = {username, password, currentMsgId: 0, maxMsgId: 0}
        const {acknowledged} = await this.insertDB('userInfo', insertStr)
        if (!acknowledged) {
            logger.info('insert fail', acknowledged);
            return Promise.reject(new Error('insert fail'));
        }
        return Promise.resolve();
    }
    async queryUser(username) {
        return this.db.collection('userInfo').find({username}).toArray()
    }
    async insertMsg(msgContent) {
        if(!username || !password) {
            return false;
        }

        const {acknowledged} = await this.db.collection('msg').insertOne(msgContent);
        if (!acknowledged) {
            logger.info('insert fail', acknowledged);
            return Promise.reject(new Error('insert fail'));
        }
        return Promise.resolve();
    }
    async queryMsgByMsgId(username) {
        return this.db.collection('msg').find({username}).toArray()
    }

    async updateMaxMsgId(userId, currentMsgId, maxMsgId) {

        if(!userId || !currentMsgId || !maxMsgId) {
            return false;
        }
        const whereStr = { userId };
        const updateStr = {$set: {maxMsgId}}
        const {acknowledged} = await this.db.collection('userInfo').updateOne(whereStr, updateStr);
        if (!acknowledged) {
            logger.info('insert fail', acknowledged);
            return Promise.reject(new Error('insert fail'));
        }
        return Promise.resolve();

    }

    async updateCurrentMsgId(userId, currentMsgId, maxMsgId) {

        if(!userId || !currentMsgId || !maxMsgId) {
            return false;
        }
        const whereStr = { userId };
        const updateStr = {$set: {maxMsgId}}
        const {acknowledged} = await this.db.collection('userInfo').updateOne(whereStr, updateStr);
        if (!acknowledged) {
            logger.info('insert fail', acknowledged);
            return Promise.reject(new Error('insert fail'));
        }
        return Promise.resolve();
    }

}

module.exports = {
    DB,
}