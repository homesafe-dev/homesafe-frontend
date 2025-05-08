import React, { useState, useRef, useEffect } from 'react';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import { useNavigate } from 'react-router-dom';
import HomesafeLogo from '../../../assets/images/HomesafeLogo.png';
import { useAuth } from '../../../contexts/AuthContext';

const FacialCapturePage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true); // Start with camera active
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { biometricLogin } = useAuth();
  const navigate = useNavigate();

  // Generate device ID on mount
  useEffect(() => {
    // Generate or retrieve device ID
    let storedDeviceId = localStorage.getItem('device_id');
    if (!storedDeviceId) {
      // Generate a simple random device ID
      storedDeviceId = `device_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('device_id', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    // Start camera immediately
    startCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Could not access camera. Please ensure camera permissions are granted.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach(track => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Make the canvas square with dimensions based on the smaller of video width/height
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;

      // Calculate offset to center the video in the canvas
      const xOffset = (video.videoWidth - size) / 2;
      const yOffset = (video.videoHeight - size) / 2;

      // Get the canvas context
      const context = canvas.getContext('2d');
      if (context) {
        // Create a circular clipping path
        context.beginPath();
        context.arc(size/2, size/2, size/2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        // Draw the current video frame on the canvas
        context.drawImage(
          video,
          xOffset, yOffset, size, size, // Source rectangle
          0, 0, size, size              // Destination rectangle
        );

        // Convert canvas to data URL (base64 image)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageDataUrl);

        // Stop the camera after capturing
        setIsCameraActive(false);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
  };

  const handleSavePicture = async () => {
    // If no image is captured yet, capture one from the video stream
    if (!capturedImage && isCameraActive && videoRef.current) {
      captureImage();
      // Wait a bit for the image to be processed
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!capturedImage) {
      setErrorMessage('Please ensure your camera is on and your face is visible');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Generate a random challenge string
      const challenge = `challenge_${Math.random().toString(36).substring(2, 15)}`;

      // For this implementation, we'll use an empty signature as shown in your example
      const signature = "";

      console.log("Sending biometric login data:", {
        device_id: deviceId,
        challenge: challenge,
        signature: signature
      });

      const response = await biometricLogin({
        device_id: deviceId,
        challenge: challenge,
        signature: signature
      });

      if (response.success) {
        // Navigate to dashboard on successful login
        navigate('/employer/dashboard');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error("Biometric login error:", error);
      setErrorMessage('Failed to authenticate. Please try again.');
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

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Facial Capture
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Kindly look into your camera and take a picture
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            {/* Hidden canvas for capturing images */}
            <canvas ref={canvasRef} className="hidden"></canvas>

            <div className="bg-white p-6 rounded-lg drop-shadow-[0_0_10px_rgba(0,0,0,0.15)] w-[344px] flex flex-col justify-center items-center">
              <div className="w-full flex justify-center mb-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100 relative">
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured facial"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 min-w-full min-h-full object-cover"
                      style={{ transform: 'scale(1.01)' }} /* Slight scale to avoid tiny borders */
                    />
                  )}
                </div>
              </div>

              {capturedImage ? (
                <div className="flex items-center space-x-2 mb-4 mt-4">
                  <button
                    onClick={retakePhoto}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Retake Photo
                  </button>
                </div>
              ) : (
                <button
                  onClick={captureImage}
                  className="px-4 py-2 bg-green-300 text-black rounded-md hover:bg-green-400 transition-colors text-sm font-medium mb-4 mt-4"
                >
                  Take a Picture
                </button>
              )}
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>
              )}
            </div>

            <button
              onClick={handleSavePicture}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors mt-8 font-medium text-lg"
              disabled={isSubmitting || !capturedImage}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Dashboard'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Click to authenticate and proceed to your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialCapturePage;
