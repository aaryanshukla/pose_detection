const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Use 'password' field
  createdAt: { type: Date, default: Date.now },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) { // Only hash the password if it’s new or modified
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);

