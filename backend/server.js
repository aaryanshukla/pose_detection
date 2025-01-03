const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

async function migratePasswords() {
    const users = await User.find();
    for (const user of users) {
        if (!user.password.startsWith('$2b$')) { // Only hash plaintext passwords
            console.log(`Hashing password for user: ${user.email}`);
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            await user.save();
            console.log(`Updated password for user: ${user.email}`);
        } else {
            console.log(`Password already hashed for user: ${user.email}`);
        }
    }
    console.log("Password migration completed!");
}


migratePasswords();

app.post("/signup", async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // do not need to check existing users, already marked in the db 

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, 
            email, 
            password
        });
        await newUser.save();

        res.status(201).json({message: 'Signup successful!'});1
    } catch (error) {
            console.error('Error during signup:', error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Password entered by user:", password);
        console.log("Hashed password from database:", user.password);

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const webtoken = process.env.JWT_SECRET

        const token = jwt.sign({ userId: user._id }, webtoken, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(5000, () => {
    console.log('Server is running on port 5000.');
});
