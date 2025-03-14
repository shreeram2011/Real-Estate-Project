const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Property } = require('./model/propertymodel'); // Ensure correct path to model
const paymentRoutes = require("./paymentRoutes.js")

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/payment", paymentRoutes);

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// GET endpoint to fetch properties
app.get('/properties', async (req, res) => {
  const { location, type } = req.query;
  
  try {
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;

    const properties = await Property.find(filter);
    
    const propertiesWithImages = properties.map((property) => {
      const imageUrls = property.images.map((imageName) => `http://localhost:8080/img/${imageName}`);
      return { ...property.toObject(), images: imageUrls };
    });

    res.status(200).json(propertiesWithImages);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
});

// POST endpoint to add a property
app.post('/add-property', upload.array('images', 10), async (req, res) => {
  try {
    const { title, location, price, beds, baths, type, description, amenities } = req.body;
    const images = req.files.map((file) => file.filename); // Save filenames to the database

    const newProperty = new Property({
      title,
      location,
      price,
      beds,
      baths,
      type,
      description,
      amenities,
      images,
    });

    await newProperty.save();

    res.status(201).send({ message: 'Property added successfully!', data: newProperty });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding property', error });
  }
});

// GET endpoint to serve images
app.get('/img/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).send({ message: 'Image not found' });
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send({ message: 'Error fetching image', error });
  }
});


// GET endpoint to serve images
app.get('/img/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

// Start Server & Connect to MongoDB
const PORT = 8080;
app.listen(PORT, async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:adminram@cluster0.30qmmci.mongodb.net/propertylist", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Server running on port ${PORT}`);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
});
