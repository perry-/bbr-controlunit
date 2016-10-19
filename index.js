var mqtt    = require('mqtt');
var client  = mqtt.connect('tcp://localhost:1883');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

// JSON API
app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});

// Start server
http.listen(1338, function(){
	console.log('Listening on localhost:1338');
});

io.on('connection', function(socket){
  console.log('Device connected');

  socket.on('control', function(direction){
      client.publish("dex/go/", direction);
  });
});

client.on('connect', function () {
  console.log("Connected to broker");
});


client.on('message', function (topic, message, packet) {
  // message is Buffer
  var now = new Date().toLocaleString();
  io.emit('mqtt', {"topic": topic.toString(), "message": message.toString(), "datetime": now});
  console.log(now + " " + topic.toString() + " " + message.toString());
});
