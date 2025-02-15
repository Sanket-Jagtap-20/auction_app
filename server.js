// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect('mongodb://localhost:27017/auctionapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a schema for the registration data
const registrationSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email:    { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },  // In production, never store plain passwords!
  confirmPassword: { type: String, required: true },
  phone:    { type: String }
});

// Create a model from the schema
const Registration = mongoose.model('Registration', registrationSchema);

// Middleware to parse URL-encoded data (form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory (where register.html is located)
app.use(express.static('public'));

// POST route for registration
app.post('/register', async (req, res) => {
  // In production, you should add proper validation and hash the password before saving
  const { fullname, email, username, password, confirmPassword, phone } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.send('Passwords do not match.');
  }
  
  try {
    const newUser = new Registration({
      fullname,
      email,
      username,
      password,       // Remember: Hash the password before storing!
      confirmPassword, // Storing confirmPassword is not recommended; it's shown here for simplicity.
      phone
    });
    await newUser.save();
    res.send('Registration successful!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
