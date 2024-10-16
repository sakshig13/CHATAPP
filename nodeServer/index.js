// node server which will handle socket io connections
const io = require("socket.io")(8000);
const users = {};
const express = require('express');
const path = require('path');
const app = express();

// Serve static files (index.html and others)
app.use(express.static(path.join(__dirname, '../'))); // Serving the parent directory

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:3000/`);
});

 io.on('connection', socket=>{
     socket.on('new-user-joined', name=>{
         console.log("New user", name);
         users[socket.id] = name;
         socket.broadcast.emit('user-joined', name);
     });

     socket.on('send', message=>{
         socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
     });

     socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
 })
