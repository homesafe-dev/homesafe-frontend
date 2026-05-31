import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield, KeyRound, Save, X } from 'lucide-react';
import userApi from '../../api/userApi';
import Toast from '../../components/common/Toast';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecurityPage: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tfaLoading, setTfaLoading] = useState(false);
  const [tfaStatus, setTfaStatus] = useState<{
    has_tfa: boolean;
    tfa_method: string | null;
  }>({
    has_tfa: false,
    tfa_method: null,
  });
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });
  const [tfaMethodDraft, setTfaMethodDraft] = useState<
    'email' | 'authenticator'
  >('email');
  const [tfaCodeInput, setTfaCodeInput] = useState('');
  const [tfaModalOpen, setTfaModalOpen] = useState(false);
  const [tfaModalLoading, setTfaModalLoading] = useState(false);
  const [tfaModalStep, setTfaModalStep] = useState<
    'method' | 'enable' | 'disable'
  >('method');
  const [tfaQrCode, setTfaQrCode] = useState<string | null>(null);
  const [tfaSecret, setTfaSecret] = useState<string | null>(null);

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showToast("New passwords don't match", 'error');
      return;
    }

    if (passwordFormData.newPassword.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      await userApi.changePassword({
        old_password: passwordFormData.currentPassword,
        new_password: passwordFormData.newPassword,
      });

      // Reset form and show success message
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      showToast('Password changed successfully', 'success');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to change password. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPasswordForm(false);
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const fetchTfaStatus = async () => {
    try {
      const response = await userApi.getTfaStatus();
      if (response.status && response.data) {
        setTfaStatus({
          has_tfa: !!response.data.has_tfa,
          tfa_method: response.data.tfa_method || null,
        });
      }
    } catch (err) {
      console.error('Unable to fetch TFA status:', err);
    }
  };

  const closeTfaModal = () => {
    if (tfaModalLoading) {
      return;
    }
    setTfaModalOpen(false);
    setTfaModalStep('method');
    setTfaCodeInput('');
    setTfaQrCode(null);
    setTfaSecret(null);
    setTfaMethodDraft('email');
  };

  const openEnableTfaFlow = () => {
    setTfaModalOpen(true);
    setTfaModalStep('method');
    setTfaCodeInput('');
    setTfaQrCode(null);
    setTfaSecret(null);
    setTfaMethodDraft('email');
  };

  const startEnableTfa = async () => {
    setTfaModalLoading(true);

    try {
      const setupResponse = await userApi.setupTfa(tfaMethodDraft);
      if (!setupResponse.status) {
        showToast(
          setupResponse.message || 'Unable to start TFA setup',
          'error'
        );
        return;
      }

      setTfaQrCode(setupResponse.data?.qr_code || null);
      setTfaSecret(setupResponse.data?.secret || null);
      setTfaCodeInput('');
      setTfaModalStep('enable');
    } catch (err: any) {
      showToast(
        err.response?.data?.message || 'Unable to start TFA setup.',
        'error'
      );
    } finally {
      setTfaModalLoading(false);
    }
  };

  const submitEnableTfa = async () => {
    if (tfaCodeInput.trim().length !== 6) {
      showToast('Enter a valid 6-digit code.', 'error');
      return;
    }

    setTfaModalLoading(true);

    try {
      const enableResponse = await userApi.enableTfa(
        tfaMethodDraft,
        tfaCodeInput.trim()
      );

      if (!enableResponse.status) {
        showToast(enableResponse.message || 'Unable to enable 2FA', 'error');
        return;
      }

      showToast(
        enableResponse.message || 'Two-factor authentication enabled.',
        'success'
      );
      await fetchTfaStatus();
      closeTfaModal();
    } catch (err: any) {
      showToast(
        err.response?.data?.message || 'Unable to enable 2FA.',
        'error'
      );
    } finally {
      setTfaModalLoading(false);
    }
  };

  const openDisableTfaFlow = async () => {
    setTfaLoading(true);

    try {
      const sendCodeResponse = await userApi.sendDisableTfaCode();
      if (!sendCodeResponse.status) {
        showToast(sendCodeResponse.message || 'Unable to continue.', 'error');
        return;
      }

      setTfaModalStep('disable');
      setTfaCodeInput('');
      setTfaModalOpen(true);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || 'Unable to update 2FA settings.',
        'error'
      );
    } finally {
      setTfaLoading(false);
    }
  };

  const submitDisableTfa = async () => {
    if (tfaCodeInput.trim().length !== 6) {
      showToast('Enter a valid 6-digit code.', 'error');
      return;
    }

    setTfaModalLoading(true);

    try {
      const disableResponse = await userApi.disableTfa(tfaCodeInput.trim());

      if (!disableResponse.status) {
        showToast(disableResponse.message || 'Unable to disable 2FA', 'error');
        return;
      }

      showToast(
        disableResponse.message || 'Two-factor authentication disabled.',
        'success'
      );
      await fetchTfaStatus();
      closeTfaModal();
    } catch (err: any) {
      showToast(
        err.response?.data?.message || 'Unable to disable 2FA settings.',
        'error'
      );
    } finally {
      setTfaModalLoading(false);
    }
  };

  const handleToggleTfa = async () => {
    if (!tfaStatus.has_tfa) {
      openEnableTfaFlow();
      return;
    }

    await openDisableTfaFlow();
  };

  React.useEffect(() => {
    fetchTfaStatus();
  }, []);

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Security Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage your account security and authentication preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Change Password Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border-default">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your password to keep your account secure. Make sure
                  it's at least 8 characters and includes a mix of letters,
                  numbers, and symbols.
                </p>
              </div>
            </div>

            {!showPasswordForm ? (
              <button
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                onClick={() => setShowPasswordForm(true)}
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordFormData.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordFormData.newPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordFormData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-border-default">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-elevated/50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-surface rounded-lg shadow-sm border border-border-default">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication. When enabled, you'll be required to
                  enter a verification code in addition to your password when
                  logging in.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Current status:{' '}
                  <span className="font-medium">
                    {tfaStatus.has_tfa
                      ? `Enabled (${tfaStatus.tfa_method || 'email'})`
                      : 'Disabled'}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleTfa}
              disabled={tfaLoading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Shield className="w-4 h-4" />
              {tfaLoading
                ? 'Processing...'
                : tfaStatus.has_tfa
                  ? 'Disable 2FA'
                  : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {tfaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:border dark:border-gray-700">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {tfaModalStep === 'method'
                  ? 'Choose 2FA Method'
                  : tfaModalStep === 'enable'
                    ? 'Enable Two-Factor Authentication'
                    : 'Disable Two-Factor Authentication'}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {tfaModalStep === 'method'
                  ? 'Select how you want to receive verification codes.'
                  : tfaModalStep === 'enable'
                    ? tfaMethodDraft === 'email'
                      ? 'Enter the 6-digit code sent to your email.'
                      : 'Scan QR, save backup secret, then enter your app code.'
                    : tfaStatus.tfa_method
                          ?.toLowerCase()
                          .includes('authenticator')
                      ? 'Enter the 6-digit code from your authenticator app to disable 2FA.'
                      : 'Enter the 6-digit code sent to your email to disable 2FA.'}
              </p>
            </div>

            {tfaModalStep === 'method' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setTfaMethodDraft('email')}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                    tfaMethodDraft === 'email'
                      ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <p className="font-medium">Email OTP</p>
                  <p className="mt-1 text-xs opacity-80">
                    Receive a one-time code in your email inbox.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTfaMethodDraft('authenticator')}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                    tfaMethodDraft === 'authenticator'
                      ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <p className="font-medium">Authenticator App</p>
                  <p className="mt-1 text-xs opacity-80">
                    Use Google Authenticator, Authy, or similar app.
                  </p>
                </button>
              </div>
            )}

            {tfaModalStep === 'enable' && (
              <div className="space-y-4">
                {tfaMethodDraft === 'authenticator' && (
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    {tfaQrCode ? (
                      <div className="flex justify-center">
                        <img
                          src={tfaQrCode}
                          alt="Authenticator QR"
                          className="h-52 w-52"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        QR code unavailable. Use the backup secret below.
                      </p>
                    )}
                    {tfaSecret && (
                      <p className="mt-3 break-all rounded bg-gray-100 px-3 py-2 text-xs font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {tfaSecret}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Verification code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={tfaCodeInput}
                    onChange={(e) =>
                      setTfaCodeInput(
                        e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    placeholder="Enter 6-digit code"
                  />
                </div>
              </div>
            )}

            {tfaModalStep === 'disable' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={tfaCodeInput}
                  onChange={(e) =>
                    setTfaCodeInput(
                      e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="Enter 6-digit code"
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeTfaModal}
                disabled={tfaModalLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              {tfaModalStep === 'method' ? (
                <button
                  type="button"
                  onClick={startEnableTfa}
                  disabled={tfaModalLoading}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                >
                  {tfaModalLoading ? 'Starting...' : 'Continue'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    tfaModalStep === 'enable'
                      ? submitEnableTfa
                      : submitDisableTfa
                  }
                  disabled={tfaModalLoading}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                >
                  {tfaModalLoading
                    ? 'Processing...'
                    : tfaModalStep === 'enable'
                      ? 'Enable 2FA'
                      : 'Disable 2FA'}
                </button>
              )}
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

export default SecurityPage;
