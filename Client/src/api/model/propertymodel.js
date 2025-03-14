const mongoose = require('mongoose');

// Define property schema
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['rent', 'sale'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amenities: {
      parking: {
        type: Boolean,
        default: false,
      },
      furnished: {
        type: Boolean,
        default: false,
      },
    },
    images: {
      type: [String], // Array of image file paths
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create and export the model
const Property = mongoose.model('Property', propertySchema);
module.exports = { Property };
