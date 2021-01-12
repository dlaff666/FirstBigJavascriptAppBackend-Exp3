const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Route for index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route for eventhandlers.js
app.get('/js/eventhandlers.js', (req, res) => {
    res.sendFile(__dirname + '/js/eventhandlers.js');
});

// Route for socket.js
app.get('/js/socket.js', (req, res) => {
    res.sendFile(__dirname + '/js/socket.js');
});

// Route for chart.js
app.get('/js/chart.js', (req, res) => {
    res.sendFile(__dirname + '/js/chart.js');
});

io.on('connection', (socket) => {

    // New connection listener
    console.log('a user connected with socket id ' + socket.id);
    /*console.log(socket.id);
    console.log(socket.client.conn.server);*/
    io.emit('connect-count', socket.client.conn.server.clientsCount);
    io.emit('connect-user', {"socketId": socket.id});

    // Chat message listener
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });

    // User update listener
    socket.on('user-update', (jsonData) => {
        io.emit('user-update', jsonData);
    });

    // User typing listener
    socket.on('user-typing', (jsonData) => {
        io.emit('user-typing', jsonData);
    });

    // Disconnect event listener 
    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('connect-count', socket.client.conn.server.clientsCount);
        io.emit('disconnect-user', {"socketId": socket.id});
    });

});

// Listener
http.listen(3000, () => {
  console.log('listening on *:3000');
});