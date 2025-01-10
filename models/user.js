
// models/user.js  
const mongoose = require('mongoose');  
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema({  
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },  
    password: { type: String, required: true, minlength: 6 },  
}, { timestamps: true }); 

// Pre-save hook to hash the password  
userSchema.pre('save', async function (next) {  
    if (this.isModified('password') || this.isNew) {  
        const salt = await bcrypt.genSalt(10);  
        this.password = await bcrypt.hash(this.password, salt);  
    }  
    next();  
});  

// Method to validate password  
userSchema.methods.validatePassword = async function (password) {  
    return await bcrypt.compare(password, this.password);  
};  

module.exports = mongoose.model('User', userSchema);