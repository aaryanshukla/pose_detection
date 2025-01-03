const mongoose = require('mongoose'); 
const { Users, History, connectToDB } = require('./index'); 

async function test() {
  try {
    await connectToDB();

    const newUser = new Users({
      username: 'aaryan',
      email: 'aaryan@example.com',
      password: 'securepassword123',
    });

    const newHistory = new History({
        username: 'testuser',
        timesUsed: 3,
        notes: "Patient has good posture"
    })

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    const saveHistory = await newHistory.save();
    console.log("User saved successfully:", saveHistory);

    const user = await Users.findOne({ username: 'testuser' });
    console.log("User found:", user);

    const historyUser = await History.findOne({ username: 'testuser' });
    console.log("User found:", historyUser);

    const updatedUser = await Users.findOneAndUpdate(
      { username: 'testuser' },
      { email: 'newemail@example.com' },
      { new: true } 
    );
    console.log("User updated:", updatedUser);

    // // Test: Delete user
    // const deletedUser = await Users.deleteOne({ username: 'testuser' });
    // console.log("User deleted:", deletedUser);

  } catch (err) {
    console.error("Error during testing:", err);
  } finally {
    mongoose.connection.close();
    console.log("Connection closed.");
  }
}

test();
