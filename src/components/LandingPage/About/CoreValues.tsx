import React from 'react';
import Vision from '../../../assets/icons/vision.svg';

export default function CoreValues() {
  return (
    <div className="w-full bg-white py-20">
      <div className="max-w-8xl mx-auto px-8">
        <h2 className="text-3xl font-medium text-center text-gray-800 mb-10">
          Our Core Values
        </h2>

        <div className="flex flex-row justify-center gap-6">
          <div className="w-72 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="relative">
                  <img src={Vision} alt="values logo" />
                </div>
              </div>
            </div>
            <h3 className="text-[24px] font-semibold text-left text-gray-700 mb-3">
              Trust
            </h3>
            <p className="text-gray-600 text-[18px] leading-relaxed text-left">
              At Homesafe, we believe that trust is the sole of business, and we
              rely on your trust in us, to match you with your perfect
              candidate, without hassle.
            </p>
          </div>

          <div className="w-72 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="relative">
                  <img src={Vision} alt="values logo" />
                </div>
              </div>
            </div>
            <h3 className="text-[24px] font-semibold text-left text-gray-700 mb-3">
              Quality
            </h3>
            <p className="text-gray-600 text-[18px] text-left leading-relaxed">
              At Homesafe, the quality of our choices is what we thrive upon,
              bringing you the best hands you could ever have in your space is
              our topmost priority.
            </p>
          </div>

          <div className="w-72 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex mb-4">
              <div className="w-16 h-16 flex items-center justify-start">
                <div className="relative">
                  <img src={Vision} alt="values logo" />
                </div>
              </div>
            </div>
            <h3 className="text-[24px] font-semibold text-left text-gray-700 mb-3">
              Safety
            </h3>
            <p className="text-gray-600 ttext-[18px] leading-relaxed text-left">
              Safety is non-negotiable in our terms and at the core of what we
              do. We are devoted to ensuring that artisans work in a safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
