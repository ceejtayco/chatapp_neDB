var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var config = require('./config.js');
var connection = mysql.createConnection(config);

var connectedClients = 0;

app.use(express.static('public'));
var username = "";

io.on('connection', function(socket) {
    connectedClients ++;
    console.log('Number of clients: ' + connectedClients);
    socket.on('disconnect', function(){
        connectedClients --;
        console.log('Number of clients: ' + connectedClients);
        console.log('User is disconnected');
    }); 

    socket.on('LoginEvent', function(data) {
        var query = "SELECT username, password FROM users WHERE username = '" + data.username + "' AND password = '" + data.password + "'"
        connection.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result != 0) {
                username = result[0].username;
                socket.emit('chatbox url', 'chatbox.html');
            }
        });
    });
    if(username != '') {
        // SOCKET FOR CHATBOX
        socket.emit('send username', username);
        var query = "SELECT username FROM users WHERE username != '" + username + "'";
       
        connection.query(query, function(err, result, fields) {
            if(err) throw err;
            if (result != 0) {
                console.log(result);
                socket.emit('getUsers', result);
            }
        });
    }
});

http.listen(5000, () => {
    console.log("Hello world");
});