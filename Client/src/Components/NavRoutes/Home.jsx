import React, { useEffect } from 'react'
import RentEase from '../Cards/RentEase';
import { IoSearch } from "react-icons/io5";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const handleSearch = () => {
    navigate('/api/properties/search-rent'); 
  };

  return (
    <div className='w-full min-h-screen overflow-hidden'>
      <div className='absolute -z-10 top-0 w-full h-full opacity-95'>
        <img
          className='w-full h-full object-cover overflow-hidden'
          src="https://images.unsplash.com/photo-1651336259530-362bce65fffe?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background Image"
        />
      </div>
      <div className='container mx-auto px-4 py-12 md:py-24'>
        <h1 className='text-4xl md:text-6xl font-bold text-zinc-200 text-center mt-24 md:mt-32' data-aos="fade-up">
          Find Your Perfect Room, Anytime, Anywhere
        </h1>
        <h4 className='text-center text-xl md:text-3xl text-zinc-200 mt-6 md:mt-12' data-aos="fade-up" data-aos-delay="200">
          Explore verified listings, secure payments, and flexible lease terms at your fingertips.
        </h4>
        <h5 className='text-center text-lg md:text-xl mt-8 md:mt-16 text-zinc-200' data-aos="fade-up" data-aos-delay="400">
          Search, filter, and rent verified rooms with flexible terms
        </h5>

        <div className='flex justify-center items-center w-full mt-8 md:mt-12' data-aos="fade-up" data-aos-delay="600">
          <button onClick={handleSearch} className='bg-green-500 rounded-md p-4 w-full md:w-auto flex items-center justify-center'>
            <span className='text-3xl px-12'>Let's Start Now... </span>
            <IoSearch className='text-3xl ml-2'/>
          </button>
        </div>
      </div>
      <div className='absolute -z-10 top-0 left-0 w-full h-full bg-black/40 backdrop-blur-[3px]'></div>
      <RentEase></RentEase>
    </div>
  )
}

export default Home