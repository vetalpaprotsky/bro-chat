var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var escapeHtml = require('escape-html');

var server = http.createServer();
var io = socketio(server);
var port = process.env.PORT || 3000;

fs.readFile('./index.html', function(error, htmlString) {
	if (error) {
		throw error;
	}

	server.on('request', function(request, response) {
		response.writeHeader(200, {'Context-Type': 'text/html'});
		response.end(htmlString);
	});

	server.listen(port, function() {
		console.log('Server is running on port ' + port);
	});
});

io.on('connection', function(socket) {
	
	socket.on('message', function(data) {
		if (data && data.nickname && data.message && typeof(data.nickname) == 'string' && typeof(data.message) == 'string') {
			socket.broadcast.emit('message', {nickname: escapeHtml(data.nickname), message: escapeHtml(data.message)});
		}
	});
});