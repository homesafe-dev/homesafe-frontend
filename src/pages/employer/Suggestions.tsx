import React, { useState, useEffect } from 'react';
import { FaUser, FaSearch, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import suggestionsApi, { Suggestion } from '../../api/suggestionsApi';
import Avatar from '../../components/common/Avatar';
import Toast from '../../components/common/Toast';

const SuggestionsPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalSuggestions, setTotalSuggestions] = useState<number>(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contractTerms, setContractTerms] = useState({
    working_days_per_month: 22,
    working_hours_per_week: 40,
    working_hours_schedule: 'Monday to Friday, 9 AM to 5 PM',
    start_date: '',
    duration_months: 12,
    terms: 'Standard employment terms with benefits',
  });
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await suggestionsApi.getSuggestions(currentPage, 15);

        if (response && response.status === true) {
          if (response.data && Array.isArray(response.data.data)) {
            setSuggestions(response.data.data);
            setTotalPages(response.data.last_page);
            setTotalSuggestions(response.data.total);
          } else {
            console.error('Unexpected response format:', response.data);
            setError('Unexpected data format received from API');
          }
        } else {
          console.error('API response error:', response);
          setError(response?.message || 'Failed to load suggestions');
        }
      } catch (err: any) {
        console.error('Error fetching suggestions:', err);
        setError(err.message || 'Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentPage]);

  // Filter suggestions based on search term
  const filteredSuggestions = Array.isArray(suggestions)
    ? suggestions.filter((suggestion) => {
        const employeeName = `${suggestion.employee.first_name} ${suggestion.employee.last_name}`.toLowerCase();
        const agentName = `${suggestion.agent.first_name} ${suggestion.agent.last_name}`.toLowerCase();
        return (
          employeeName.includes(searchTerm.toLowerCase()) ||
          agentName.includes(searchTerm.toLowerCase()) ||
          suggestion.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          suggestion.suggestion_reason.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDetails = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsAcceptModalOpen(true);
    // Set default start date to next Monday
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7));
    setContractTerms(prev => ({
      ...prev,
      start_date: nextMonday.toISOString().split('T')[0],
    }));
  };

  const handleRejectSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedSuggestion) return;

    try {
      setIsProcessing(true);
      const response = await suggestionsApi.respondToSuggestion(selectedSuggestion.id, {
        response: 'rejected',
      });

      if (response.status) {
        showToast('Suggestion rejected successfully', 'success');
        // Refresh suggestions list
        const updatedSuggestions = suggestions.map(s =>
          s.id === selectedSuggestion.id ? { ...s, status: 'rejected' as const } : s
        );
        setSuggestions(updatedSuggestions);
        setIsDetailsModalOpen(false);
        setIsRejectModalOpen(false);
      } else {
        showToast(response.message || 'Failed to reject suggestion', 'error');
      }
    } catch (err: any) {
      console.error('Error rejecting suggestion:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reject suggestion';
      showToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleConfirmAccept = async () => {
    if (!selectedSuggestion) return;

    try {
      setIsProcessing(true);
      const response = await suggestionsApi.respondToSuggestion(selectedSuggestion.id, {
        response: 'accepted',
        ...contractTerms,
      });

      if (response.status) {
        showToast('Suggestion accepted successfully! Contract created.', 'success');
        // Refresh suggestions list
        const updatedSuggestions = suggestions.map(s =>
          s.id === selectedSuggestion.id ? { ...s, status: 'accepted' as const } : s
        );
        setSuggestions(updatedSuggestions);
        setIsAcceptModalOpen(false);
        setIsDetailsModalOpen(false);
      } else {
        showToast(response.message || 'Failed to accept suggestion', 'error');
      }
    } catch (err: any) {
      console.error('Error accepting suggestion:', err);
      const errorMessage = err.response?.data?.data || err.message || 'Failed to accept suggestion';
      showToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseAcceptModal = () => {
    setIsAcceptModalOpen(false);
    setSelectedSuggestion(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg w-full mx-auto p-3 sm:p-4 lg:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Employee Suggestions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Review employee suggestions from agents ({totalSuggestions} total)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search suggestions..."
            className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Suggestions List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No suggestions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'No employee suggestions available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={suggestion.employee.avatar || ''}
                      firstName={suggestion.employee.first_name}
                      lastName={suggestion.employee.last_name}
                      size="md"
                      showStatus={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.employee.first_name} {suggestion.employee.last_name}
                        </p>
                        {getStatusBadge(suggestion.status)}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {suggestion.employee.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Suggested by: {suggestion.agent.first_name} {suggestion.agent.last_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Date: {formatDate(suggestion.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(suggestion)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaEye className="mr-1 h-3 w-3" />
                      View Details
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">Reason:</span> {suggestion.suggestion_reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion Details Modal */}
      {isDetailsModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 p-6 m-4 max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-800">Suggestion Details</h2>
              <button
                onClick={handleCloseModal}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Employee Information */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Employee Information</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar
                    src={selectedSuggestion.employee.avatar || ''}
                    firstName={selectedSuggestion.employee.first_name}
                    lastName={selectedSuggestion.employee.last_name}
                    size="lg"
                    showStatus={false}
                  />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedSuggestion.employee.first_name} {selectedSuggestion.employee.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{selectedSuggestion.employee.email}</p>
                    {selectedSuggestion.employee.phone && (
                      <p className="text-sm text-gray-500">{selectedSuggestion.employee.phone}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Salary:</span>
                    <span className="ml-2 text-gray-600">₦{parseFloat(selectedSuggestion.employee.salary).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2 text-gray-600">{selectedSuggestion.status}</span>
                  </div>
                  {selectedSuggestion.employee.address && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Address:</span>
                      <span className="ml-2 text-gray-600">{selectedSuggestion.employee.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Information */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Suggested by Agent</h3>
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={selectedSuggestion.agent.avatar || ''}
                    firstName={selectedSuggestion.agent.first_name}
                    lastName={selectedSuggestion.agent.last_name}
                    size="md"
                    showStatus={false}
                  />
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      {selectedSuggestion.agent.first_name} {selectedSuggestion.agent.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{selectedSuggestion.agent.email}</p>
                  </div>
                </div>
              </div>

              {/* Suggestion Details */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Suggestion Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedSuggestion.status)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date Submitted:</span>
                    <span className="ml-2 text-gray-600">{formatDate(selectedSuggestion.created_at)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reason:</span>
                    <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedSuggestion.suggestion_reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedSuggestion.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(selectedSuggestion)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <FaTimes className="inline mr-2" />
                    {isProcessing ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleAcceptSuggestion(selectedSuggestion)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <FaCheck className="inline mr-2" />
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseRejectModal}></div>
          <div className="bg-white rounded-lg w-full max-w-md relative z-10 p-6 m-4 border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-800">Reject Suggestion</h2>
              <button
                onClick={handleCloseRejectModal}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to reject the suggestion for{' '}
                <span className="font-medium text-gray-900">
                  {selectedSuggestion.employee.first_name} {selectedSuggestion.employee.last_name}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. The agent will be notified of the rejection.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseRejectModal}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Rejecting...' : 'Reject Suggestion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accept Suggestion Modal */}
      {isAcceptModalOpen && selectedSuggestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseAcceptModal}></div>
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 p-6 m-4 max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-800">Accept Suggestion & Create Contract</h2>
              <button
                onClick={handleCloseAcceptModal}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Employee Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Employee</h3>
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={selectedSuggestion.employee.avatar || ''}
                    firstName={selectedSuggestion.employee.first_name}
                    lastName={selectedSuggestion.employee.last_name}
                    size="md"
                    showStatus={false}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedSuggestion.employee.first_name} {selectedSuggestion.employee.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{selectedSuggestion.employee.email}</p>
                  </div>
                </div>
              </div>

              {/* Contract Terms Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Contract Terms</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days per Month
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={contractTerms.working_days_per_month}
                      onChange={(e) => setContractTerms(prev => ({
                        ...prev,
                        working_days_per_month: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours per Week
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={contractTerms.working_hours_per_week}
                      onChange={(e) => setContractTerms(prev => ({
                        ...prev,
                        working_hours_per_week: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={contractTerms.start_date}
                      onChange={(e) => setContractTerms(prev => ({
                        ...prev,
                        start_date: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Months)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={contractTerms.duration_months}
                      onChange={(e) => setContractTerms(prev => ({
                        ...prev,
                        duration_months: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Hours Schedule
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Days</label>
                      <select
                        value={contractTerms.working_hours_schedule.split(',')[0]?.trim() || 'Monday to Friday'}
                        onChange={(e) => {
                          const currentSchedule = contractTerms.working_hours_schedule.split(',');
                          const timeRange = currentSchedule[1]?.trim() || '9 AM to 5 PM';
                          setContractTerms(prev => ({
                            ...prev,
                            working_hours_schedule: `${e.target.value}, ${timeRange}`
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Monday to Friday">Monday to Friday</option>
                        <option value="Monday to Saturday">Monday to Saturday</option>
                        <option value="Monday to Sunday">Monday to Sunday</option>
                        <option value="Tuesday to Saturday">Tuesday to Saturday</option>
                        <option value="Sunday to Thursday">Sunday to Thursday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <select
                        value={contractTerms.working_hours_schedule.split(',')[1]?.trim().split(' to ')[0] || '9 AM'}
                        onChange={(e) => {
                          const currentSchedule = contractTerms.working_hours_schedule.split(',');
                          const days = currentSchedule[0]?.trim() || 'Monday to Friday';
                          const endTime = currentSchedule[1]?.trim().split(' to ')[1] || '5 PM';
                          setContractTerms(prev => ({
                            ...prev,
                            working_hours_schedule: `${days}, ${e.target.value} to ${endTime}`
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="6 AM">6 AM</option>
                        <option value="7 AM">7 AM</option>
                        <option value="8 AM">8 AM</option>
                        <option value="9 AM">9 AM</option>
                        <option value="10 AM">10 AM</option>
                        <option value="11 AM">11 AM</option>
                        <option value="12 PM">12 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <select
                        value={contractTerms.working_hours_schedule.split(',')[1]?.trim().split(' to ')[1] || '5 PM'}
                        onChange={(e) => {
                          const currentSchedule = contractTerms.working_hours_schedule.split(',');
                          const days = currentSchedule[0]?.trim() || 'Monday to Friday';
                          const startTime = currentSchedule[1]?.trim().split(' to ')[0] || '9 AM';
                          setContractTerms(prev => ({
                            ...prev,
                            working_hours_schedule: `${days}, ${startTime} to ${e.target.value}`
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="3 PM">3 PM</option>
                        <option value="4 PM">4 PM</option>
                        <option value="5 PM">5 PM</option>
                        <option value="6 PM">6 PM</option>
                        <option value="7 PM">7 PM</option>
                        <option value="8 PM">8 PM</option>
                        <option value="9 PM">9 PM</option>
                        <option value="10 PM">10 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms and Conditions
                  </label>
                  <textarea
                    value={contractTerms.terms}
                    onChange={(e) => setContractTerms(prev => ({
                      ...prev,
                      terms: e.target.value
                    }))}
                    rows={4}
                    placeholder="Enter contract terms and conditions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseAcceptModal}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAccept}
                  disabled={isProcessing || !contractTerms.start_date}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Creating Contract...' : 'Accept & Create Contract'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default SuggestionsPage;
