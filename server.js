//Server imports
const express = require('express');
var http = require('http'),
    socketIO = require('socket.io'),
    server, io;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000

//other imports
const router = require('./src/router/index');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
// const passportAuth = require('./src/middleware/passport_init');


//middlewares
app.use(cookieSession({
    maxAge: 24 * 7 * 60 * 60 * 1000,
    keys: [process.env.SECRET_KEY || 'secretkey']
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// passportAuth;

//routes
app.use(router);

server = http.Server(app);
server.listen(port, () => {
    console.log("welcome to port "+port);
});
let origins = (process.env.ORIGINS || "http://localhost:3000").split(',');
io = socketIO(server, {
    cors: {
        origin: origins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
    }
});
global.users = {};

global.io = io;
io.on('connection', (socket) => {
    socket.on('login',async function(data) {
        console.log(socket.id+" is connected")
    });
    socket.on('disconnect', async function() {
        console.log('user ' + socket.id + ' disconnected');
    });
});
