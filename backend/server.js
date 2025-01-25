const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const PostureData = require('./models/PostureData')

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

async function migratePasswords() {
  const users = await User.find();
  for (const user of users) {
    if (!user.password.startsWith('$2b$')) {
      console.log(`Hashing password for user: ${user.email}`);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await user.save();
      console.log(`Updated password for user: ${user.email}`);
    } else {
      console.log(`Password already hashed for user: ${user.email}`);
    }
  }
  console.log('Password migration completed!');
}

const validateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};


  



app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    console.log(`User created successfully: ${normalizedEmail}`);
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Request body:", req.body);


    const normalizedEmail = email.trim().toLowerCase();

    console.log('Email entered during login:', req.body.email);

    const user = await User.findOne({ email: normalizedEmail });
    console.log('User found in database:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/dashboard', validateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const userData = await User.findById(req.userId);
    console.log(userData)

    if (!userData) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Dashboard data fetched successfully.', data: userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.post('/posedetection', async (req, res) => {
  try {
    const { poseResults, newNotes, userId } = req.body;

    const objectUserId = new mongoose.Types.ObjectId(userId);

    console.log('PoseDetection endpoint hit');
    console.log('Query:', { userId: objectUserId });
    console.log('Update Data:', {
      notes: newNotes,
      landmarks: poseResults,
      timestamp: new Date(),
    });

    const updatedPosture = await PostureData.findOneAndUpdate(
      { userId: objectUserId }, 
      {
        $set: {
          notes: newNotes,
          landmarks: poseResults,
          timestamp: new Date(), 
        },
      },
      { upsert: true, new: true, runValidators: true } 
    );
    

    console.log('Updated Posture:', updatedPosture);

    if (!updatedPosture) {
      return res.status(404).json({ message: 'Posture data not found or created.' });
    }

    res.status(200).json({ message: 'Pose data saved successfully.', data: updatedPosture });
  } catch (error) {
    console.error('Error saving pose data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000.');
});
