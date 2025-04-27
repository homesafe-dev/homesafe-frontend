import React from 'react';
import Vision from '../../../assets/icons/vision.svg';

export default function CoreValues() {
  return (
    <div className="w-full bg-white py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-medium text-center text-gray-800 mb-8 sm:mb-10">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex mb-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={Vision}
                    alt="Trust icon"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-left text-gray-700 mb-3">
              Trust
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed text-left">
              At Homesafe, we believe that trust is the sole of business, and we
              rely on your trust in us, to match you with your perfect
              candidate, without hassle.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex mb-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={Vision}
                    alt="Quality icon"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-left text-gray-700 mb-3">
              Quality
            </h3>
            <p className="text-gray-600 text-base sm:text-lg text-left leading-relaxed">
              At Homesafe, the quality of our choices is what we thrive upon,
              bringing you the best hands you could ever have in your space is
              our topmost priority.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex mb-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={Vision}
                    alt="Safety icon"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-left text-gray-700 mb-3">
              Safety
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed text-left">
              Safety is non-negotiable in our terms and at the core of what we
              do. We are devoted to ensuring that artisans work in a safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
