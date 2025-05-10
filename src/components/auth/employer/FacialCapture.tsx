import React, { useState, useRef, useEffect } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { useNavigate, Link } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';
import { useAuth } from '../../../contexts/AuthContext';
import { RegistrationData, UserType } from '../../../contexts/types';
import { IoCloudUploadOutline } from 'react-icons/io5';

const FacialCapturePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
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
      setErrorMessage('There was an error with your registration data. Please try again.');
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

  const handleSavePicture = async () => {
    if (!selectedImage) {
      setErrorMessage('Please upload a profile picture to continue');
      return;
    }

    if (!registrationData) {
      setErrorMessage('Registration data is missing. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Create FormData object for file upload
      const formData = new FormData();

      // Add all registration data fields individually
      formData.append('email', registrationData.email);
      formData.append('password', registrationData.password);
      formData.append('first_name', registrationData.first_name);
      formData.append('last_name', registrationData.last_name);
      formData.append('phone', registrationData.phone);
      formData.append('address', registrationData.address);
      formData.append('gender', registrationData.gender);

      // For is_employer, we need to send it as a boolean
      // Let's try a different approach - send it as a numeric value
      const isEmployer = registrationData.is_employer === true;
      formData.append('is_employer', isEmployer ? '1' : '0');

      // Add the image file as 'avatar'
      formData.append('avatar', selectedImage);

      console.log("Sending registration data with profile image");

      // Log the form data for debugging
      for (const pair of formData.entries()) {
        if (pair[0] === 'avatar') {
          console.log(pair[0], '[File object]');
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      // Use the AuthContext's completeRegistration function
      // This ensures the auth state is properly updated
      console.log('Using AuthContext to complete registration');
      const response = await auth.completeRegistration(formData);

      // Process the response
      console.log('Registration response:', response);

      if (response.success) {
        // Clear session storage
        sessionStorage.removeItem('registrationData');
        sessionStorage.removeItem('signupEmail');
        sessionStorage.removeItem('signupPassword');

        // Set a flag to indicate this is not a page refresh
        // But we want the ProtectedRoute to treat it as a refresh to allow time for auth to initialize
        sessionStorage.setItem('is_page_refresh', 'true');

        // Add a small delay before navigation to allow auth state to update
        await new Promise(resolve => setTimeout(resolve, 500));

        // Navigate to the appropriate dashboard based on the role
        if (response.data && response.data.role) {
          const role = response.data.role;
          console.log('User role:', role);

          if (role === 'employer') {
            console.log('Navigating to employer dashboard');
            navigate('/employer/dashboard');
          } else if (role === 'agent') {
            console.log('Navigating to agent dashboard');
            navigate('/agent/dashboard');
          } else if (role === 'employee') {
            console.log('Navigating to employee dashboard');
            navigate('/employee/dashboard');
          } else {
            // Default to employer dashboard if role is not recognized
            console.log('Unrecognized role, defaulting to employer dashboard');
            navigate('/employer/dashboard');
          }
        } else {
          // Default to employer dashboard if role is not provided
          console.log('No role in response, defaulting to employer dashboard');
          navigate('/employer/dashboard');
        }
      } else {
        setErrorMessage(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage('Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
          <div className="mb-8">
            <Link to="/">
              <img src={HomesafeLogo} alt="Homesafe Logo" className="" />
            </Link>
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

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Profile Picture
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Please upload a profile picture to complete your registration
            </p>
          </div>

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
                      <span className="text-xs mt-2 text-center">No image selected</span>
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
                <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>
              )}
            </div>

            <button
              onClick={handleSavePicture}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors mt-8 font-medium text-lg"
              disabled={isSubmitting || !selectedImage}
            >
              {isSubmitting ? 'Processing...' : 'Complete Registration'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Click to complete your registration and proceed to your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialCapturePage;
