const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const PostureDataSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
  landmarks: {type: Array, required: true},
  notes: {type: Array, required: true}
});

module.exports = mongoose.model('PostureData', PostureDataSchema);
