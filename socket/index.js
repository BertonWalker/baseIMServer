const { createServer } = require("http");
const { Server } = require("socket.io");
const { socketPort } = require("../config");
const { onConnect } = require("./Client");
const { logger } = require('./socket-logger');

const httpServer = createServer();

const io = new Server(httpServer, {
    // options
    serveClient: true,
    transports: ['websocket', 'polling'],
    cookie: false,
    cors:{
        methods:['GET', 'POST']
    }
});

io.on("connection", onConnect);

httpServer.listen(socketPort);
logger.info(`socket server Listening on port ${socketPort}`);
