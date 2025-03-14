import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("rent");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);

  const fetchProperties = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8080/properties?location=${location}&type=${type}`
      );
      setProperties(response.data);
    } catch (error) {
      setError("Failed to fetch properties.");
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (propertyId) => {
    navigate(`/chat?propertyId=${propertyId}`);
  };

  const handlePayment = async (amount, propertyId) => {
    try {
      const { data } = await axios.post("http://localhost:8080/payment/create-order", {
        amount,
      });

      const options = {
        key: "rzp_test_Q6bFNeQnz7fTeh",
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "RentEase",
        description: "Rent Property Payment",
        handler: async function (response) {
          if (!response.razorpay_payment_id) {
            alert("Payment failed!");
            return;
          }

          try {
            const verifyRes = await axios.post("http://localhost:8080/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              alert("Payment Successful!");
            } else {
              alert("Payment Verification Failed.");
            }
          } catch (error) {
            alert("Payment verification error.");
            console.error("Verification error:", error);
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Property Listings</h1>

      <div className="mb-6">
        <label className="block mb-2">Enter Location</label>
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter location..."
          className="w-full p-3 border rounded-lg"
        />
        <label className="block mt-4 mb-2">Select Type</label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
        <button
          onClick={fetchProperties}
          className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg"
        >
          Fetch Properties
        </button>
      </div>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {properties.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Available Properties</h2>
          <div className="grid grid-cols-1 gap-4">
            {properties.map((property) => (
              <div key={property._id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p className="text-gray-700">{property.location}</p>
                <p className="font-bold">Price: ₹{property.price}</p>
                <p>Beds: {property.beds} | Baths: {property.baths}</p>
                <p>{property.description}</p>
                <div className="mt-2">
                  <strong>Amenities:</strong>
                  <ul>
                    <li>{property.amenities.parking ? "✔ Parking" : "❌ No Parking"}</li>
                    <li>{property.amenities.furnished ? "✔ Furnished" : "❌ Unfurnished"}</li>
                  </ul>
                </div>
                <div className="mt-4">
                  {property.images.length > 0 && <ImageSlider images={property.images} />}
                </div>
                <div className="mt-4 flex justify-between">
                  <button onClick={() => handleChatClick(property._id)} className="py-2 px-4 bg-green-500 text-white rounded">Chat</button>
                  <button onClick={() => handlePayment(property.price, property._id)} className="py-2 px-4 bg-blue-500 text-white rounded">
                    Pay ₹{property.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {properties.length === 0 && !loading && !error && location && (
        <p className="text-center text-gray-500">No properties found for &quot;{location}&quot;</p>
      )}
    </div>
  );
};

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        alt={`Property Image ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded-lg"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            ❯
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="flex justify-center mt-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
