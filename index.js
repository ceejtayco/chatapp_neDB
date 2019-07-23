var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var config = require('./config.js');
var connection = mysql.createConnection(config);




app.use(express.static('public'));

io.on('connection', function(socket) {
    console.log('A user is connected');

    socket.on('disconnect', function(){
        console.log('User is disconnected');
    }); 

    socket.on('LoginEvent', function(data) {
        var query = "SELECT username, password FROM users WHERE username = '" + data.username + "' AND password = '" + data.password + "'"
        connection.query(query, function(err, result, fields) {
            if (err) throw err;
            if (result != 0) {
                socket.emit('send login credentials', result);
                console.log(result[0].username);
                
            }
            
        });
       
    });
});

http.listen(5000, () => {
    console.log("Hello world");
});