// Schema for Users 
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;


// const uri = process.env.MONGODB_URI;


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
