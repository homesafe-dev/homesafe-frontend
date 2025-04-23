import React, { useState, useRef } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { Link } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';

const FacialCapturePage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:flex md:w-1/2 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2">
          <div className="relative w-full h-full">
            <img
              src={signupImg1}
              alt="Top signup image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1D2125D9]" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1/2">
          <div className="relative w-full h-full">
            <img
              src={signupImg2}
              alt="Bottom signup image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1D2125D9]" />
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Logo */}
          <div className="mb-8">
            <img src={HomesafeLogo} alt="Homesafe Logo" className="" />
          </div>

          <div className="max-w-md">
            <p className="text-center text-[#F4F4F4] text-[24px] font-normal">
              "Our Mission at Homesafe is to make hiring safe, simple, and
              efficient for every Living Space, and to create a job search space
              for Artisans to apply through".
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-6 md:p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Facial Capture
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Kindly look into your camera and take a picture
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              capture="user"
            />

            <div className="bg-white p-4 md:p-6 rounded-lg drop-shadow-[0_0_10px_rgba(0,0,0,0.15)] w-full max-w-[344px] flex flex-col justify-center items-center">
              <div
                className="w-full flex justify-center mb-4"
                onClick={capturedImage ? undefined : triggerFileInput}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured facial"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4 text-sm md:text-base">
                      Click to capture
                    </div>
                  )}
                </div>
              </div>

              {capturedImage ? (
                <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 md:mb-8 w-full">
                  <button
                    onClick={retakePhoto}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Retake Photo
                  </button>
                  <button className="w-full sm:w-auto px-4 py-2 bg-green-300 text-black rounded-md hover:bg-green-400 transition-colors text-sm font-medium">
                    Save Picture
                  </button>
                </div>
              ) : (
                <button
                  onClick={triggerFileInput}
                  className="w-full sm:w-auto px-4 py-2 bg-green-300 text-black rounded-md hover:bg-green-400 transition-colors text-sm font-medium mb-6 md:mb-8"
                >
                  Take a Picture
                </button>
              )}
            </div>

            <Link
              to="/employee/forgot-password"
              className="block w-full mt-6 md:mt-8"
            >
              <button className="w-full bg-green-300 text-black py-2 px-4 rounded-md hover:bg-green-400 transition-colors">
                Continue
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialCapturePage;
