const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const User = require("./models/User")

// so we have the user schema now we need to implement the logic for the login and signup endpoints 

dotenv.config()

const app = express();

app.use(cors({
    origin: 'http://localhost:3000' 
}));
app.use(express.json());


const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


app.post("/signup", async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // do not need to check existing users, already marked in the db 

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, 
            email, 
            passwordHash
        });
        await newUser.save();

        res.status(201).json({message: 'Signup successful!'});1
    } catch (error) {
            console.error('Error during signup:', error);
    }
})


app.post("/login", async (req, res) => {

    try {

        const {email, password} = req.body;

        const checkUser = User.findOne({email: email})

        if (!checkUser) {
            return res.status(404).json({error: "User not found"});
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            return res.status(401).json({error: "Invalid Credentials"});

        }

        res.status(200).json({message: "Login successful"});

    } catch(error) {
        console.error('Error during login', error);
    }

})

app.listen(8000, () => {
    console.log('Server is running on port 8000.');
});