
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const uri = process.env.MONGODB_URI;


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const historySchema = new Schema({
    username: {type: String, required: true},
    timesUsed: {type: Number, required: true, default: 0},
    notes: {type: String, default: "N/A"}

});

const Users = mongoose.model('Users', userSchema);

const History = mongoose.model('History', historySchema)

async function connectToDB() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("An error occurred while connecting to MongoDB:", err);
  }
}

module.exports = {Users, History, connectToDB };
