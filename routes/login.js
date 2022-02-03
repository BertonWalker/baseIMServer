var express = require('express');
var router = express.Router();
const {DB} = require('../lib/database');
const dbClient = new DB();

/* GET users listing. */
router.post('/login', async function(req, res, next) {

  try {
    const {username, password} = req.body;
    const result = await dbClient.queryUser(username);
    if (result.length === 0) {
      res.send({code: 1003, msg: '用户名或密码错误'})
    } else if(result[0].password !== password) {
      res.send({code: 1003, msg: '用户名或密码错误'})
    } else {
      // res.cookie("username", 'username', {httpOnly: true, expires: 0, signed: true})
      res.send({code: 0});
    }
  } catch (e) {
    res.send({code:1002, msg: e.message});

  }
  res.end();
});

router.post('/register', async function(req, res, next) {

  try {
    const {username, password} = req.body;
    await dbClient.insertUser(username, password);
    res.send({code: 0});
  } catch (e) {
    res.send({code:1001, msg: e.message});
  }
  res.end();
});

module.exports = router;
