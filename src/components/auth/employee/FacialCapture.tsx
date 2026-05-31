import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
} from '../shared/AuthLayout';
import { authTokens } from '../shared/authTokens.ts';

const EmployeeFacialCapturePage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleContinue = () => {
    navigate('/employee/forgot-password');
  };

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Facial capture"
        subtitle="Kindly look into your camera and take a picture."
      />

      <div className="flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          capture="user"
        />

        <div
          className="w-full max-w-[344px] flex flex-col items-center rounded-2xl border bg-white p-6"
          style={{ borderColor: authTokens.fieldBorder }}
        >
          <div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border flex items-center justify-center bg-gray-50 cursor-pointer mb-5"
            style={{ borderColor: authTokens.fieldBorder }}
            onClick={capturedImage ? undefined : triggerFileInput}
            onKeyDown={(e) => {
              if (!capturedImage && (e.key === 'Enter' || e.key === ' ')) {
                triggerFileInput();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Capture photo"
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured facial"
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-sm text-center px-4"
                style={{ color: authTokens.bodyColor }}
              >
                Click to capture
              </span>
            )}
          </div>

          {capturedImage ? (
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              <button
                type="button"
                onClick={retakePhoto}
                className="flex-1 h-[44px] rounded-full border bg-white text-sm font-medium transition-colors hover:bg-gray-50"
                style={{
                  borderColor: authTokens.fieldBorder,
                  color: authTokens.titleColor,
                }}
              >
                Retake Photo
              </button>
              <button
                type="button"
                className="flex-1 h-[44px] rounded-full text-sm font-bold"
                style={{
                  backgroundColor: authTokens.primary,
                  color: authTokens.primaryDark,
                }}
              >
                Save Picture
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full h-[44px] rounded-full text-sm font-bold"
              style={{
                backgroundColor: authTokens.primary,
                color: authTokens.primaryDark,
              }}
            >
              Take a Picture
            </button>
          )}
        </div>

        <div className="w-full mt-6">
          <AuthPrimaryButton type="button" onClick={handleContinue}>
            Continue
          </AuthPrimaryButton>
        </div>
      </div>
    </AuthSplitPage>
  );
};

export default EmployeeFacialCapturePage;
