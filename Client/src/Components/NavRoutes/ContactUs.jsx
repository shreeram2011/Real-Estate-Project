import { useState } from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    phone: '',
    message: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          subject: ''
        });
      } else {
        const data = await response.json();
        alert(data.msg || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-16">
      <motion.div
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-green-600 text-white p-8">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="mb-6 text-base">
              Email, call, or complete the form to learn how we can help.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-base">Email</p>
                <p className="text-base">renteasee3@gmail.com</p>
              </div>
              <div>
                <p className="font-semibold text-base">Phone</p>
                <p className="text-base">8282282753</p>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Customer Support</h3>
                <p className="text-base">Available 24/7 for your queries.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Feedback</h3>
                <p className="text-base">Your input shapes our future.</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 text-base"
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 text-base"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 text-base"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-2.5 text-base"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit
              </motion.button>

              <p className="text-sm text-gray-500">
                By contacting us, you agree to our{' '}
                <a href="#" className="text-green-600 hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;