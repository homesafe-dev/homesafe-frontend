import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { RegistrationData } from '../../../contexts/types';
import { IoCloudUploadOutline } from 'react-icons/io5';
import {
  AuthSplitPage,
  AuthHeader,
  AuthPrimaryButton,
} from '../shared/AuthLayout';
import { authTokens } from '../shared/authTokens.ts';

const FacialCapturePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  // Initialize component and get registration data
  useEffect(() => {
    // Get registration data from session storage
    const storedData = sessionStorage.getItem('registrationData');
    if (!storedData) {
      // Redirect back to onboarding form if data is not found
      navigate('/signup/onboarding-form');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData) as RegistrationData;
      setRegistrationData(parsedData);
    } catch (error) {
      console.error('Error parsing registration data:', error);
      setErrorMessage(
        'There was an error with your registration data. Please try again.'
      );
      navigate('/signup/onboarding-form');
      return;
    }
  }, [navigate]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file is an image
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        setErrorMessage('Please select a valid image file (JPEG, JPG, or PNG)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Clear any previous error
      setErrorMessage(null);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const buildRegistrationFormData = (
    includeAvatar: boolean
  ): FormData | null => {
    if (!registrationData) {
      return null;
    }

    const formData = new FormData();
    formData.append('email', registrationData.email);
    formData.append('password', registrationData.password);
    formData.append('first_name', registrationData.first_name);
    formData.append('last_name', registrationData.last_name);
    formData.append('phone', registrationData.phone);
    formData.append('address', registrationData.address);
    formData.append('gender', registrationData.gender);

    const isEmployer = registrationData.is_employer === true;
    formData.append('is_employer', isEmployer ? '1' : '0');

    if (registrationData.occupation) {
      formData.append('occupation', registrationData.occupation.toString());
    }

    if (includeAvatar && selectedImage) {
      formData.append('avatar', selectedImage);
    }

    return formData;
  };

  const finishRegistration = async (includeAvatar: boolean) => {
    if (!registrationData) {
      setErrorMessage(
        'Registration data is missing. Please go back and try again.'
      );
      return;
    }

    const formData = buildRegistrationFormData(includeAvatar);
    if (!formData) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await auth.completeRegistration(formData);

      // Process the response

      if (response.success) {
        // Clear session storage
        sessionStorage.removeItem('registrationData');
        sessionStorage.removeItem('signupEmail');
        sessionStorage.removeItem('signupPassword');

        // Set a flag to indicate this is not a page refresh
        // But we want the ProtectedRoute to treat it as a refresh to allow time for auth to initialize
        sessionStorage.setItem('is_page_refresh', 'true');

        // Add a small delay before navigation to allow auth state to update
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Navigate to the appropriate dashboard based on the role
        if (response.data && response.data.role) {
          const role = response.data.role;

          if (role === 'employer') {
            navigate('/employer/dashboard');
          } else if (role === 'agent') {
            navigate('/agent/dashboard');
          } else if (role === 'employee') {
            navigate('/employee/dashboard');
          } else {
            // Default to employer dashboard if role is not recognized

            navigate('/employer/dashboard');
          }
        } else {
          // Default to employer dashboard if role is not provided

          navigate('/employer/dashboard');
        }
      } else {
        setErrorMessage(
          response.message || 'Registration failed. Please try again.'
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteRegistration = () => finishRegistration(true);
  const handleSkipForNow = () => finishRegistration(false);

  return (
    <AuthSplitPage>
      <AuthHeader
        title="Profile picture"
        subtitle="Add a photo from your device. You can skip for now."
      />

      <div className="flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg drop-shadow-[0_0_10px_rgba(0,0,0,0.15)] w-[344px] flex flex-col justify-center items-center">
          <div className="w-full flex justify-center mb-4">
            <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100 relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile picture"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <IoCloudUploadOutline size={32} />
                  <span className="text-xs mt-2 text-center">
                    No image selected
                  </span>
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
          />

          {previewImage ? (
            <div className="flex items-center space-x-2 mb-4 mt-4">
              <button
                onClick={removeImage}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Remove Image
              </button>
            </div>
          ) : (
            <button
              onClick={triggerFileInput}
              className="px-4 py-2 bg-green-300 text-black rounded-md hover:bg-green-400 transition-colors text-sm font-medium mb-4 mt-4"
            >
              Upload Picture
            </button>
          )}
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="w-full mt-6 space-y-3">
          <AuthPrimaryButton
            type="button"
            onClick={handleCompleteRegistration}
            loading={isSubmitting}
            loadingLabel="Processing..."
          >
            Complete registration
          </AuthPrimaryButton>
          <button
            type="button"
            onClick={handleSkipForNow}
            disabled={isSubmitting}
            className="w-full text-sm font-semibold hover:underline disabled:opacity-60"
            style={{ color: authTokens.primaryDark }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </AuthSplitPage>
  );
};

export default FacialCapturePage;
