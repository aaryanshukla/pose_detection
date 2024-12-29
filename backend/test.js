const mongoose = require('mongoose'); 
const { Users, connectToDB } = require('./index'); 

async function test() {
  try {
    await connectToDB();

    const newUser = new Users({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'securepassword123',
    });

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    const user = await Users.findOne({ username: 'testuser' });
    console.log("User found:", user);

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
