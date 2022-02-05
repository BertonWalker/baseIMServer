var log4js = require("log4js");
var logger = log4js.getLogger('socket');
logger.level = "debug";

module.exports = {
    logger,
}