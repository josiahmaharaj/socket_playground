var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    // res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/pages/index.html');
});

io.on('connection', (socket) => {
    //Log new connection
    console.log('a user connected');
    //Notify connected users of new connection
    socket.broadcast.emit('chat message', 'New user connected to Chat');
    //Notify connected users when someone disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('chat message', 'User Left');
        console.log('user disconnected');
    });
    //Chat box
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});