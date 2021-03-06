const express = require('express');
const app=express()
app.use(express.static('public'))

server=app.listen(3000)
const io = require("socket.io")(server)

io.on('connection', (socket) => {
	console.log('New user connected')

  socket.username = "Anonymous"

  socket.on('change_username',(data) =>{
    socket.username = data.username
  })

  socket.on('new_message',(data) =>{
    io.sockets.emit('new_message',{
      message:data.message,
      username:socket.username
    })
  })
	var timeout =undefined;
  socket.on('typing',(data) =>{
		if(timeout)clearTimeout(timeout)

    socket.broadcast.emit('typing',{
      username:socket.username,
			isTyping:true
    })
		
		timeout=setTimeout(()=>{
			socket.broadcast.emit('typing',{
	      username:socket.username,
				isTyping:false
	    })
		},1000)
  })

})
