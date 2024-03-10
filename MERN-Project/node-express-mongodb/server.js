const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use('/attach', express.static(path.join(__dirname, 'attach')));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Multer setup for handling PNG or JPEG file uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpeg and .jpg format allowed!'), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'attach/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/MernAssignment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schema and model to match the requirements
const formDataSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  Name: String,
  email: String,
  password: String,
  mobile: Number,
  Zip: Number,
  attachments: [String]
});

const FormData = mongoose.model('FormData', formDataSchema);

// Express route for handling registration and file upload
app.post('/register', upload.single('attachments'), async (req, res) => {
  try {
    const { Name, email, password, mobile, Zip } = req.body;
    // Validation for 10-digit mobile number and 6-digit ZIP code
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be 10 digits.' });
    }
    if (!/^\d{6}$/.test(Zip)) {
      return res.status(400).json({ success: false, message: 'ZIP code must be 6 digits.' });
    }

    // Find the highest userId and increment it by 1
    const highestUserId = await FormData.findOne().sort({ userId: -1 }).select('userId');
    const nextUserId = (highestUserId ? highestUserId.userId : 0) + 1;

    const attachments = req.file ? req.file.path : null; // Handle the attachment

    const newFormData = new FormData({
      userId: nextUserId,
      Name,
      email,
      password,
      mobile: Number(mobile),
      Zip: Number(Zip),
      attachments: attachments ? [attachments] : []
    });

    await newFormData.save();
    res.status(200).json({ success: true, message: 'Registration successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await FormData.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if the passwords match (consider using bcrypt in a real app)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Remove password from user object
    const { password: userPassword, ...userData } = user.toObject();

    // Login successful, send user data without password
    res.status(200).json({ success: true, message: 'Login successful.', user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


app.put('/user/updateData/:userId', upload.single('attachments'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { Name, email, password, mobile, Zip } = req.body;

    // Find the user by user ID
    let user = await FormData.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update user data
    user.Name = Name || user.Name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.mobile = mobile || user.mobile;
    user.Zip = Zip || user.Zip;

    // Handle the attachment
    if (req.file) {
      user.attachments = [req.file.path]; // Replace the attachments with the new file path
    }

    // Save the updated user data
    await user.save();

    // Send the updated user data in the response
    res.status(200).json({ success: true, message: 'User data updated successfully.', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by user ID
    const user = await FormData.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Remove password from user object
    const { password: userPassword, ...userData } = user.toObject();

    // Send user data without password in the response
    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


app.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await FormData.find({}, { password: 0 }); // Exclude the password field from the query results

    // Send the list of users in the response
    res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
