const app = require('../app')

const io = app.get('io')

io.sockets.on('connection', (socket) => {
  console.log(' >>>>> Socket.io Is Connected!')

  // Wait for connection
  socket.on('someEvent', (data) => {
    // ... do something
    io.emit('test', data)
  })
})

module.exports = io
