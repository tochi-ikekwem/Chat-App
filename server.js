const Message = require('./models/message');  
const User = require('./models/user');  

// Example route for sending a message  
app.post('/messages', async (req, res) => {  
  const { username, message } = req.body;  

  const newMessage = new Message({ username, message });  
  await newMessage.save();  
  io.emit('message', newMessage); // Emit message to all connected clients  

  res.status(201).send(newMessage);  
});



const express = require('express');  
const http = require('http');  
const { Server } = require('socket.io');  
const mongoose = require('mongoose');  

const app = express();  
const server = http.createServer(app);  
const io = new Server(server);  

// Middleware  
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB  
mongoose.connect('mongodb://localhost:27017/chat-app', {  
  useNewUrlParser: true,  
  useUnifiedTopology: true,  
})  
.then(() => console.log('MongoDB connected'))  
.catch(err => console.error('MongoDB connection error:', err));  

// Start the server  
const PORT = process.env.PORT || 5000;  
server.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);  
});  

// Socket.IO connection  
io.on('connection', (socket) => {  
  console.log('A user connected:', socket.id);  
  


  // Handle incoming messages  
  socket.on('message', (msg) => {  
    console.log('Message received:', msg);  
    // Broadcast the message to all connected clients  
    io.emit('message', msg);  
  });  


  socket.on('disconnect', () => {  
    console.log('User disconnected', socket.id);  
  });  
});