import React, { useState, useEffect } from 'react';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";
import { IoMdStarOutline } from "react-icons/io";
import Faq from '../FAQ/Faq';

const testimonials = [
  {
    name: "Ravi Singh",
    image: '/Images/Person1.jpg',  
    rating: 5,
    review: "Rent Ease made finding my perfect rental so easy! The platform's search filters helped me quickly narrow down my options based on location, budget, and amenities.",
  },
  {
    name: "Anivesh Singh",
    image: '/Images/Person2.jpg',  
    rating: 4,
    review: "Great platform! The customer service team was very helpful and I found a house within a week!",
  },
  {
    name: "Shreeram Yadav",
    image: '/Images/Person3.jpg',  
    rating: 4,
    review: "Renting a home has never been this easy. The verified listings gave me peace of mind, and the landlord communication was seamless.",
  },
  {
    name : "Sandip Kori",
    image : '/Images/Person4.jpg',
    rating : 5,
    review : "I love how this site provides all the necessary details upfront. I didn't need to contact multiple agents to get the information I needed!",
  }
];

const Rating = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < rating ? <MdOutlineStar className='text-xl md:text-2xl' /> : <IoMdStarOutline className='text-xl md:text-2xl' />}
          </span>
        ))}
      </div>
    );
  };

  const { name, image, rating, review } = testimonials[currentIndex];

  return (
    <div className="px-4 md:px-0">
      <h1 className='text-3xl md:text-6xl text-center font-semibold mt-8 md:mt-16'>What Renters Are Saying</h1>
      <div className="rating-section text-center py-6 md:py-10">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="testimonial-card flex flex-col items-center w-full md:w-4/5 h-[400px] md:h-96 p-4 md:p-6 shadow-lg transition-transform duration-1000 ease-in-out transform">
            <img
              src={image}
              alt={name}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover mb-4"
            />
            
            <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>
            
            <div className="text-yellow-500 mb-2 md:mb-4">{renderStars(rating)}</div>
            
            <p className="text-gray-700 italic text-base md:text-xl flex-grow">&ldquo;{review}&rdquo;</p>
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-4 md:mt-0">
          <button onClick={handlePrev} className="p-2 bg-red-500 rounded-full">
            <FaLongArrowAltLeft className='text-2xl md:text-3xl'/>
          </button>
          <button onClick={handleNext} className="p-2 bg-red-500 rounded-full">
            <FaLongArrowAltRight className='text-2xl md:text-3xl'/>
          </button>
        </div>
      </div>
      <Faq />
    </div>
  );
};

export default Rating;
