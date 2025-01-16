
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

const PostureDataSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true, unique: true },
  landmarks: {type: Array, required: true},
  notes: {type: Array, required: true}
});


const Users = mongoose.model('Users', userSchema);

const History = mongoose.model('History', historySchema)

const PostureData = mongoose.model('PostureData', PostureDataSchema)

async function connectToDB() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("An error occurred while connecting to MongoDB:", err);
  }
}

module.exports = {Users, History, PostureData, connectToDB };
