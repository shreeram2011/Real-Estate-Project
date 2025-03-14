import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8080/my-properties', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:8080/delete-property/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setProperties(properties.filter((property) => property._id !== propertyId));
      alert('Property deleted successfully!');
    } catch (error) {
      alert('Failed to delete property');
    }
  };

  return (
    <div className="container">
      <h1>My Properties</h1>
      {properties.map((property) => (
        <div key={property._id} className="property-card">
          <h2>{property.title}</h2>
          <p>{property.location}</p>
          <p>{property.price}</p>
          <button onClick={() => handleDelete(property._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default MyProperties;
