import React, { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import MedicalImg from '../../assets/images/MedicalBig.png';
import { AiOutlineEye } from 'react-icons/ai';
import { IoCloudUploadOutline } from 'react-icons/io5';
import userApi from '../../api/userApi';

interface MedicalRecord {
  id: number;
  user_id: number;
  medical_file: string;
  date_uploaded: string;
}

interface MedicalReportCardProps {
  record: MedicalRecord;
}

const MedicalReportCard: React.FC<MedicalReportCardProps> = ({ record }) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Create the full URL for the medical file
  const fileUrl = `http://192.227.190.166${record.medical_file}`;

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
      <div className="mb-3 sm:mb-4">
        <img
          src={MedicalImg}
          alt="Medical Report"
          className="w-full h-32 sm:h-40 object-cover rounded-lg"
        />
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
        Medical Record
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
        Uploaded on {formatDate(record.date_uploaded)}
      </p>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center text-[#6C7A89] text-xs sm:text-sm font-medium border border-[#DCDEE5] w-full sm:w-[88px] h-[32px] rounded-[6px] hover:bg-gray-50 transition-colors"
      >
        <AiOutlineEye className="mr-1 sm:mr-2" size={14} />
        View
      </a>
    </div>
  );
};

const Medical: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch medical records when component mounts
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  // Function to fetch medical records
  const fetchMedicalRecords = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await userApi.getMedicalRecords();

      if (response.status && response.data && response.data.data) {
        setMedicalRecords(response.data.data);
      } else {
        setLoadError(response.message || 'Failed to load medical records');
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setLoadError('An error occurred while loading medical records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file is an image or document
      if (!file.type.match('image/(jpeg|jpg|png|gif)|application/pdf')) {
        setErrorMessage('Please select a valid image or PDF file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const response = await userApi.uploadMedicalRecord(selectedFile);

      if (response.status) {
        setUploadSuccess(true);
        setSelectedFile(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Refresh the medical records list
        fetchMedicalRecords();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      } else {
        setErrorMessage(response.message || 'Failed to upload medical record');
      }
    } catch (error) {
      console.error('Error uploading medical record:', error);
      setErrorMessage('An error occurred while uploading the medical record');
    } finally {
      setIsUploading(false);
    }
  };

  // Filter records based on search term
  const filteredRecords = medicalRecords.filter((record) => {
    if (!searchTerm) return true;

    // Convert search term and date to lowercase for case-insensitive search
    const searchLower = searchTerm.toLowerCase();
    const date = new Date(record.date_uploaded)
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .toLowerCase();

    // Check if date contains the search term
    return date.includes(searchLower);
  });

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Medical Report
        </h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[320px] lg:w-[480px] pl-10 pr-4 py-2 border border-gray-100 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base"
          />
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      {/* Upload Medical Record Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
          Upload Medical Record
        </h2>

        <div className="mb-3 sm:mb-4">
          <label className="w-full h-[42px] sm:h-[50px] flex items-center px-3 py-2 border border-[#DEE0E3] rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-400 text-xs sm:text-sm cursor-pointer">
            <IoCloudUploadOutline className="mr-2" size={16} />
            <span className="truncate">
              {selectedFile
                ? selectedFile.name
                : 'Upload or drop a medical file (.png, .jpg, .pdf)'}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className={`w-full sm:w-auto px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
            !selectedFile
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 transition-colors'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Medical Record'}
        </button>

        {errorMessage && (
          <p className="mt-2 text-xs sm:text-sm text-red-600">{errorMessage}</p>
        )}

        {uploadSuccess && (
          <p className="mt-2 text-xs sm:text-sm text-green-600">
            Medical record uploaded successfully!
          </p>
        )}
      </div>

      {/* Medical Records List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading medical records...</p>
        </div>
      ) : loadError ? (
        <div className="text-center py-8">
          <p className="text-red-600">{loadError}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm
              ? 'No medical records match your search.'
              : 'No medical records found. Upload your first medical record above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredRecords.map((record) => (
            <MedicalReportCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Medical;
