var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var config = require('./config.js');
var connection = mysql.createConnection(config);

var connectedClients = 0;

app.use(express.static('public'));
app.use(express.json({limit: "1mb"}));
io.on('connection', function(socket) {
    connectedClients ++;
    console.log('Number of clients: ' + connectedClients);
    socket.emit('client number', "user_client" + connectedClients);
    socket.on('disconnect', function(){
        connectedClients --;
        console.log('Number of clients: ' + connectedClients);
        console.log('User is disconnected');
        
    });

    socket.on('chat message', function(data) {
        console.log('Labay data balik sa client ' + data);
        io.emit('chat message', data);
    });
    

});
var message = "";

app.post('/saveMessage', function (req, res) {
    apiData = req;
    res.json({
        status: 'success',
        message: "Caitlyn Jules Tayco"
    });
    message = apiData.body;
    // Save Message To database
    var insert_message = "INSERT INTO messages VALUES(null, '" + apiData.body.user + "', '"+ apiData.body.message +"')";
    connection.query(insert_message, function(error, results, fields) {
        if(error) throw error;
    });
    console.log("Message: " + apiData.body.user + "; User: " + apiData.body.message);
});

app.get('/endpoint', async function(req, res){
    res.json({
        data: await fetchData()
    });
});

http.listen(5000, () => {
    console.log("Listening to port 5000");
});

var someVar = [];

function fetchData() {
    var query = 'SELECT DISTINCT user, message FROM messages';
    connection.query(query, function(error, rows) {
        if(error) throw error;
        setValue(rows);
    });
    return someVar;
 }

function setValue(value) {
    someVar = value;
    // console.log(someVar);
}
