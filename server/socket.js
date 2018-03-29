const WebSocketServer = require('ws').Server;
const SOCKET_PORT = process.env.SOCKET_PORT || 9000
const wss = new WebSocketServer({port: SOCKET_PORT});


let clients = [];

wss.on('connection', function(socket) {
  console.log('Opened connection ');
  clients.push(socket)

  // Send data back to the client
  // When data is received
  socket.on('message', function(message) {
    //Save to DB
    //Broadcast to all user
    // wss.clients is an array of all connected clients
    // wss.clients.forEach(function each(client) {
    //   client.send(json);
    //   console.log('Sent: ' + json);
    // });
    wss.broadcast(message, socket);
    console.log('Received: ' + message);
  });

  // The connection was closed
  socket.on('close', function() {
    console.log('Closed Connection ');
  });

});
