var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var port = process.env.PORT || 3000

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var numUsers = 0;

io.on('connection', (socket => {
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });

        io.emit('new message', data);

    });

    //when client emits 'adds user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        //we store the username in the socket sessioin for this client
        //console.log(username);
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // console.log(username);
        // console.log(numUsers);

        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    //when the user disconnects
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that the client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
        // console.log(numUsers);
    });
}));