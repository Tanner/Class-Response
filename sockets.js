
var socketio = require('socket.io');
var io;
var clients = {};

var app = require('./app.js');

module.exports = {
    startSocketServer: function () {
        io = socketio.listen(app.server);

        io.configure('development', function () {
            //io.set('transports', ['websocket', 'xhr-polling']);
            //io.enable('log');
        });

        io.configure('production', function () {
            io.enable('browser client minification');  // send minified client
            io.enable('browser client etag');          // apply etag caching logic based on version number
            io.set('log level', 1);                    // reduce logging
            io.set('transports', [                     // enable all transports (optional if you want flashsocket)
                'websocket'
              , 'flashsocket'
              , 'htmlfile'
              , 'xhr-polling'
              , 'jsonp-polling'
            ]);
        });

        io.sockets.on('connection', function (socket) {
            console.log("new connection: " + socket.id);

            socket.on('disconnect', function () {
                console.log("device disconnected");
            });

            socket.on('connect_device', function (data, fn) {
                console.log("data from connected device: " + data);
                for (var col in data) {
                    console.log(col + " => " + data[col]);
                }
            });
        });

        return io;
    }
};