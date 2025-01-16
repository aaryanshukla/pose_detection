const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) { 
    }
    next();
});

module.exports = mongoose.model('Users', userSchema);

