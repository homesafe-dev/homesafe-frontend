import React, { useState } from 'react';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminSecurityPage: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate passwords
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordFormData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Here you would normally call an API to change the password
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and show success message
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      setSuccess('Password changed successfully');
    } catch (err) {
      setError('Failed to change password. Please try again.');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Security</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-base font-medium text-gray-700 mb-1">
          Change Password
        </h2>
        <p className="text-sm text-[#81899E] mb-4 max-w-md mt-2">
          The new password will be used to log into your account. Make sure it's
          at least 8 characters and includes a mix of letters, numbers, and
          symbols for better security.
        </p>

        {!showPasswordForm ? (
          <button
            className="px-4 py-2 text-[#174B35] border border-[#A5EA91] mt-2 rounded-md text-sm hover:bg-gray-50"
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 max-w-md">
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordFormData.currentPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordFormData.newPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordFormData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#A5EA91] text-[#174B35] rounded-md text-sm hover:bg-green-200 flex items-center"
              >
                {loading ? (
                  <>
                    <span className="mr-2">Saving</span>
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-[#174B35] rounded-full"></div>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-medium text-gray-700 mb-1">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-[#81899E] mb-4 max-w-md mt-2">
          Add an extra layer of security to your account by enabling two-factor
          authentication. When enabled, you'll be required to enter a
          verification code in addition to your password when logging in.
        </p>

        <button className="px-4 py-2 text-[#174B35] border border-[#A5EA91] mt-2 rounded-md text-sm hover:bg-gray-50">
          Enable 2FA
        </button>
      </div>
    </div>
  );
};

export default AdminSecurityPage;
