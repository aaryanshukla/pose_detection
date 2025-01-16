const mongoose = require('mongoose'); 
const { Users, History, connectToDB } = require('./index'); 
const PostureData = require('./models/PostureData'); // Import the PostureData model

async function test() {
  try {
    await connectToDB();

    const newUser = new Users({
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: 'strongpassword456',
    });
    
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    const newPostureData = new PostureData({
      userId: savedUser._id, 
      postureStatus: 'Good',
      landmarks: [
        { x: 0.5, y: 0.3, z: 0.0, name: 'nose', score: 0.98 },
        { x: 0.4, y: 0.4, z: 0.1, name: 'left_shoulder', score: 0.90 },
      ],
      notes: "The user has consistent good posture.",
    });
    const savedPostureData = await newPostureData.save();
    console.log("Posture data saved successfully:", savedPostureData);

    const newHistory = new History({
      username: 'rahul',
      timesUsed: 3,
      notes: "Patient has good posture",
    });
    const saveHistory = await newHistory.save();
    console.log("History saved successfully:", saveHistory);

    const postureData = await PostureData.findOne({ userId: savedUser._id });
    console.log("Posture data found:", postureData);

    const updatedPostureData = await PostureData.findOneAndUpdate(
      { userId: savedUser._id },
      { notes: "Posture improved over time." },
      { new: true } 
    );
    console.log("Posture data updated:", updatedPostureData);

    const historyUser = await History.findOne({ username: 'rahul' });
    console.log("History found:", historyUser);

  
  } catch (err) {
    console.error("Error during testing:", err);
  } finally {
    mongoose.connection.close();
    console.log("Connection closed.");
  }
}

test();
