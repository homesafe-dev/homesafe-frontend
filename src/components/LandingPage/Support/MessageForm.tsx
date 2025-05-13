import React, { useState } from 'react';
import FormImage from '../../../assets/images/msgform.jpg';

const MessageForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
   
  };

  return (
    <div className="bg-[#F5F5F5] rounded-lg overflow-hidden py-[4rem] mt-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-[2rem]">
        {/* Left side - Image */}
        <div className="md:w-1/2 md:rounded-[18px]">
          <img
            src={FormImage}
            alt="Person typing on keyboard"
            className="w-full h-full object-cover md:rounded-[18px]"
          />
        </div>

        {/* Right side - Form */}
        <div className="md:w-1/2 p-8 bg-white md:rounded-[24px]">
          <h2 className="text-[24px] font-semibold text-center text-[#2C303E] mb-6">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-[#0E0B29] mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0E0B29] mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#0E0B29] mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#A5EA91] hover:bg-green-500 text-[16px] text-[#24292E] font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Send a Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
