const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('@koa/cors');
const logger = require('./lib/logger');
const { download, abortDownload } = require('./lib/downloader');
const { ytdlpUpdater } = require('./lib/updater');

const app = new Koa()
const server = createServer(app.callback())
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', socket => {
    logger('ws', `${socket.handshake.address} connected!`)
    // message listeners
    socket.on('send-url', args => {
        logger('ws', args)
        download(socket, args)
    })
    socket.on('abort', () => {
        abortDownload(socket)
    })
    socket.on('update-bin', () => {
        ytdlpUpdater(socket)
    })
})

io.on('disconnect', (socket) => {
    logger('ws', `${socket.handshake.address} disconnected`)
})

app
    .use(cors())
    .use(serve(path.join(__dirname, 'dist')))

logger('koa', `Server started on port ${process.env.PORT || 3022}`)

server.listen(process.env.PORT || 3022)