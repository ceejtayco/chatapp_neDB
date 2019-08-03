var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Datastore = require('nedb');
var db = new Datastore({ filename: 'messages' }); //Instantiate data storage (database)
db.loadDatabase(); //load database
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

    // Catch numbers of triggers
    if(apiData.body.user != apiData.body.current) {
        var obj = { username: apiData.body.user, message: apiData.body.message, date: new Date()};
        db.insert(obj, function(err, doc) {
            console.log(doc);
        });
    } 
}); 

app.get('/endpoint', async function(req, res){

    db.find({}, function(err,doc){
        res.json({
            data:doc
        })
        console.log(doc);
    });
});

http.listen(5000, () => {
    console.log("Listening to port 5000");
});
