var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongodb = require('mongodb').MongoClient;

var uri = "mongodb+srv://ceejtayco:Midwtbywi23@cluster0-ujxio.mongodb.net/test?retryWrites=true&w=majority"
var connectedClients = 0;

app.use(express.static('public'));
app.use(express.json({limit: "1mb"}));
io.on('connection', function(socket) {
    connectedClients ++;
    console.log('Number of clients: ' + connectedClients);
    // socket.emit('client number', "user_client" + connectedClients);
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

app.post('/saveMessage', function (req, res) {
    apiData = req;
    res.json({
        status: 'success',
        message: "Message successfully saved to mongodb!"
    });

    // Catch number of triggers
    if(apiData.body.current != apiData.body.user) {
        // Save Message To database
        mongodb.connect(uri, { useNewUrlParser: true }, function(err, db){
            if (err) throw err;
            var database = db.db("db_chatapp");
            var obj = { username: apiData.body.user, message: apiData.body.message, date: new Date()};
            database.collection("messages").insertOne(obj, function(err, res) {
                if(err) throw err;
                console.log(obj);
            });
            db.close();
        });
    }
});

app.get('/endpoint', async function(req, res){
    mongodb.connect(uri, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var database = db.db("db_chatapp");
        
        database.collection("messages").find({}).toArray(function(err, result) {
            if(err) throw err;
            res.json({
                data: result
            });
        });
        db.close();
    });
});

http.listen(5000, () => {
    console.log("Listening to port 5000");
});
