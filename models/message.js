// models/message.js  
const mongoose = require('mongoose');  

const messageSchema = new mongoose.Schema({  
    username: { type: String, required: true, minlength: 3, maxlength: 30 },  
    message: { type: String, required: true, minlength: 1, maxlength: 500 },  
}, { timestamps: true });  

module.exports = mongoose.model('Message', messageSchema);