import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "", // Added baths field
    type: "rent", // Added type field
    amenities: {
      parking: false,
      furnished: false,
    }, // Added amenities field
    description: "", // Added description field
    images: [], // We'll be appending images here
    ownerName: "", // Added ownerName field
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [name]: checked },
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => formDataObj.append("images", file));
      } else if (key === "amenities") {
        formDataObj.append("amenities[parking]", formData.amenities.parking);
        formDataObj.append("amenities[furnished]", formData.amenities.furnished);
      } else {
        formDataObj.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.post(
        "http://localhost:8080/add-property", // Ensure this matches your backend route
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      alert("Property submitted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit property. Try again.");
    }
  };
  

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl shadow-lg mt-4" style={{ marginTop: '64px' }}>
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        Add a Property
      </h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <label className="block mt-4 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <label className="block mt-4 mb-2">Beds</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <label className="block mt-4 mb-2">Baths</label> {/* Added baths input */}
            <input
              type="number"
              name="baths"
              value={formData.baths}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <label className="block mt-4 mb-2">Type</label> {/* Added type input */}
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
            <label className="block mt-4 mb-2">Owner Name</label> {/* Added ownerName input */}
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/2 mt-4 py-3 bg-gray-500 text-white rounded-lg"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-1/2 mt-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              required
              className="w-full p-3 border rounded-lg"
            />
            <label className="block mt-4 mb-2">Amenities</label> {/* Added amenities checkboxes */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.amenities.parking}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-700">Parking</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.amenities.furnished}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-700">Furnished</span>
              </label>
            </div>
            <label className="block mt-4 mb-2">Description</label> {/* Added description input */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <button type="submit" onClick={() => navigate('/api/properties/search-rent')} className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg">
              Submit Property
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProperty;
