const express = require('express');  
const http = require('http');  
const { Server } = require('socket.io');  
const mongoose = require('mongoose');  
const cors = require('cors');  
const Message = require('./models/message.js');  
const User = require('./models/user.js');  
const authRoutes = require('./routes/auth.js');  
require('dotenv').config();  

const app = express();  
const server = http.createServer(app);  
const io = new Server(server);  

// Middleware  
app.use(cors());  
app.use(express.json());  
app.use(express.static('public'));  
app.use('/api/auth', authRoutes);  

// Connect to MongoDB  
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app')  
    .then(() => console.log('MongoDB connected'))  
    .catch(err => console.error('MongoDB connection error:', err));  

// Example route for sending a message  
app.post('/messages', async (req, res) => {  
    const { username, message } = req.body;  

    try {  
        const newMessage = new Message({ username, message });  
        await newMessage.save();  
        io.emit('message', newMessage); // Emit message to all connected clients  
        res.status(201).send(newMessage);  
    } catch (error) {  
        console.error('Error saving message:', error);  
        res.status(500).json({ message: 'Failed to send message' });  
    }  
});  

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
        io.emit('message', msg); // Broadcast the message to all connected clients  
    });  

    socket.on('disconnect', () => {  
        console.log('User disconnected', socket.id);  
    });  
});