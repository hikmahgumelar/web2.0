var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , Twit = require('twit')
  , io = require('socket.io').listen(server);

server.listen(8080);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var watchList = ['love', 'hate'];

var T = new Twit(require('./models/config.js'));

T.stream('statuses/filter', { track: watchList },function (stream) {
    stream.on('tweet', function (tweet) {
        io.sockets.emit('tweet', tweet.text);
        console.log(tweet.text);
    });
});

io.sockets.on('connection', function (socket) {
    console.log('Connected');
}); 
