require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8080;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/", require("./routers"));
// Thiết lập thư mục tĩnh cho 'assets'
app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
// Thiết lập thư mục tĩnh cho 'vendor'
app.use('/vendor', express.static(path.join(__dirname, '../client/vendor')));

const { MONGO_URL } = process.env;

server.listen(port, () => {
    mongoose
        .connect(MONGO_URL)
        .then(() => console.log("Connect to mongoDB successfully"))
        .catch((err) => console.error("Could not connect to MongoDB", err));
    console.log(`Example app listening at http://localhost:${port}`);
});

const { getUserByToken, updateUserStatus} = require('./controllers/socket.controller');
const { saveUserById } = require('./services/redis');
const connectedUsers = new Map();
io.on('connection', async (socket) => {
    console.log('A user connected');
    const token = socket.handshake.query.token;
    const user = await getUserByToken(token);
    socket.emit('profile', { user });


    socket.on('disconnect', async () => {
        console.log('A user disconnected');

        // Check if this is the last open connection of this user
        if (!isUserConnectedOnOtherSockets(user._id, socket.id)) {
            // Update user status to 'offline' in the database
            const userUpdated = await updateUserStatus(user._id, 'offline');
            await saveUserById(userUpdated);
        }
    });
})

function isUserConnectedOnOtherSockets(userId, currentSocketId) {
    for (let [id, socketId] of connectedUsers.entries()) {
        if (id === userId && socketId !== currentSocketId) {
            return true;
        }
    }
    return false;
}