import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Heart,
  Upload,
  Eye,
  FileText,
  Calendar,
  X,
} from 'lucide-react';
import MedicalImg from '../../assets/images/MedicalBig.png';
import userApi from '../../api/userApi';
import Toast from '../../components/common/Toast';

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
      month: 'short',
      day: 'numeric',
    });
  };

  // Create the full URL for the medical file
  const fileUrl = `http://192.227.190.166${record.medical_file}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={MedicalImg}
          alt="Medical Report"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Medical
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Medical Record
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Uploaded {formatDate(record.date_uploaded)}</span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Record
        </a>
      </div>
    </div>
  );
};

const Medical: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

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
        setSelectedFile(null);
        showToast('Medical record uploaded successfully!', 'success');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Refresh the medical records list
        fetchMedicalRecords();
      } else {
        const errorMsg = response.message || 'Failed to upload medical record';
        setErrorMessage(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Error uploading medical record:', error);
      const errorMsg = 'An error occurred while uploading the medical record';
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
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
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Medical Records
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Upload and manage your medical records
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100">
        {/* Search Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by date..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredRecords.length} of {medicalRecords.length} records
          </div>
        </div>

        {/* Upload Medical Record Section */}
        <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upload Medical Record
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors cursor-pointer bg-gray-50 hover:bg-green-50/10">
                <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400 block truncate">
                    {selectedFile
                      ? selectedFile.name
                      : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setErrorMessage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-green-600" />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                !selectedFile || isUploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Medical Record
                </>
              )}
            </button>
          </div>
        </div>

        {/* Medical Records List */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : loadError ? (
            <div className="p-12 text-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
                {loadError}
              </div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No medical records found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Upload your first medical record above'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecords.map((record) => (
                <MedicalReportCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Medical;
