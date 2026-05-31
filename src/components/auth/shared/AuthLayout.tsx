import React from 'react';
import { Link } from 'react-router-dom';
import signupImg1 from '../../../assets/images/signupImg1.png';
import signupImg2 from '../../../assets/images/signupImg2.png';
import HomesafeLogo2 from '../../../assets/images/HomesafeLogo2.svg';
import BrandMark from '../../../assets/images/logo.svg';
import GoogleLogo from '../../../assets/images/google_logo.png';
import AppleLogo from '../../../assets/images/apple_logo.png';
import { getBackendBaseUrl } from '../../../utils/config';
import { authTokens } from './authTokens';

export const AuthBrandLogo: React.FC<{ size?: number }> = ({ size = 72 }) => {
  const padding = Math.round(size * 0.22);
  const markHeight = Math.round(size * 0.72);

  return (
    <div
      className="inline-flex items-center justify-center rounded-[22px]"
      style={{
        backgroundColor: authTokens.logoTint,
        padding,
      }}
    >
      <img
        src={BrandMark}
        alt=""
        aria-hidden
        style={{ height: markHeight, width: 'auto' }}
        className="block"
      />
    </div>
  );
};

export const AuthSplitLeftPanel: React.FC = () => (
  <div
    className="hidden md:flex md:w-1/2 p-4 min-h-0 self-stretch"
    style={{ backgroundColor: authTokens.pageBg }}
  >
    <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[480px]">
      <div className="absolute top-0 left-0 w-full h-1/2">
        <div className="relative w-full h-full">
          <img
            src={signupImg1}
            alt=""
            className="w-full h-full object-cover object-[center_10%]"
          />
          <div className="absolute inset-0 bg-[#1D2125D9]" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2">
        <div className="relative w-full h-full">
          <img src={signupImg2} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#1D2125D9]" />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="max-w-md">
          <p className="text-center text-[#F4F4F4] text-[24px] font-normal leading-snug">
            &ldquo;Our Mission at Homesafe is to make hiring safe, simple, and
            efficient for every Living Space, and to create a job search space
            for Artisans to apply through&rdquo;.
          </p>
        </div>
      </div>
    </div>
  </div>
);

type AuthRightPanelProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  hideBrandLogo?: boolean;
};

const AuthLegalFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <div
      className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-12 md:right-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[12px]"
      style={{ color: authTokens.bodyColor }}
    >
      <span>Copyright &copy; {year} HomeSafe Enterprises LTD.</span>
      <Link to="/" className="hover:underline sm:text-right">
        Privacy Policy
      </Link>
    </div>
  );
};

export const AuthRightPanel: React.FC<AuthRightPanelProps> = ({
  children,
  footer,
  wide = false,
  hideBrandLogo = false,
}) => (
  <div
    className="w-full md:w-1/2 relative flex items-center justify-center px-6 py-10 md:px-12 md:py-16 min-h-0 self-stretch"
    style={{ backgroundColor: authTokens.pageBg }}
  >
    <Link to="/" className="absolute top-6 left-6 md:top-10 md:left-12 z-10">
      <img
        src={HomesafeLogo2}
        alt="Homesafe"
        className="h-7 w-auto max-w-[160px]"
      />
    </Link>

    <div
      className={`flex flex-col items-stretch w-full overflow-y-auto max-h-[calc(100vh-8rem)] py-2 ${
        wide ? 'max-w-4xl' : 'max-w-[545px]'
      }`}
    >
      {!hideBrandLogo && (
        <div className="flex justify-center mb-7">
          <AuthBrandLogo />
        </div>
      )}
      {children}
      {footer}
    </div>

    <AuthLegalFooter />
  </div>
);

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
};

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-7">
    <h1
      className="text-[28px] font-extrabold tracking-tight leading-tight"
      style={{ color: authTokens.titleColor }}
    >
      {title}
    </h1>
    {subtitle ? (
      <p
        className="mt-2.5 text-[15px] leading-relaxed"
        style={{ color: authTokens.bodyColor }}
      >
        {subtitle}
      </p>
    ) : null}
  </div>
);

export const AuthBackLink: React.FC<{ to: string; label?: string }> = ({
  to,
  label = 'Back to Sign in',
}) => (
  <p
    className="mt-5 text-center text-sm"
    style={{ color: authTokens.bodyColor }}
  >
    <Link
      to={to}
      className="font-semibold hover:underline"
      style={{ color: authTokens.primaryDark }}
    >
      {label}
    </Link>
  </p>
);

type AuthPrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
};

export const AuthPrimaryButton: React.FC<AuthPrimaryButtonProps> = ({
  children,
  loading = false,
  loadingLabel,
  className = '',
  disabled,
  ...props
}) => (
  <button
    type="submit"
    className={`w-full h-[52px] rounded-full text-[16px] font-bold transition-opacity disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    style={{
      backgroundColor: authTokens.primary,
      color: authTokens.primaryDark,
    }}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (loadingLabel ?? 'Please wait...') : children}
  </button>
);

export const AuthOrDivider: React.FC<{ label?: string }> = ({
  label = 'Or',
}) => (
  <div className="my-5 flex items-center gap-3.5">
    <div
      className="h-px flex-1"
      style={{ backgroundColor: authTokens.fieldBorder }}
    />
    <span
      className="text-[13px] font-semibold shrink-0"
      style={{ color: authTokens.bodyColor }}
    >
      {label}
    </span>
    <div
      className="h-px flex-1"
      style={{ backgroundColor: authTokens.fieldBorder }}
    />
  </div>
);

type AuthSocialFooterProps = {
  onGoogle?: () => void;
  onApple?: () => void;
  googleHref?: string;
};

export const AuthSocialFooter: React.FC<AuthSocialFooterProps> = ({
  onGoogle,
  onApple,
  googleHref,
}) => {
  const handleGoogleClick = () => {
    if (onGoogle) {
      onGoogle();
      return;
    }
    if (googleHref) {
      window.location.href = googleHref;
      return;
    }
    const baseUrl = getBackendBaseUrl();
    const currentOrigin = window.location.origin;
    const callbackPath = '/auth/google/callback';
    const redirectUrl = `${currentOrigin}${callbackPath}`;
    const encodedRedirect = encodeURIComponent(redirectUrl);
    window.location.href = `${baseUrl}/auth/google/login?redirect_url=${encodedRedirect}`;
  };

  return (
    <>
      <AuthOrDivider />
      <p
        className="text-center text-[13px] font-semibold"
        style={{ color: authTokens.bodyColor }}
      >
        Continue With Account
      </p>
      <div className="mt-5 flex items-stretch gap-3">
        <button
          type="button"
          onClick={handleGoogleClick}
          className="flex-1 flex items-center justify-center gap-2.5 h-[48px] rounded-lg border bg-white text-[14px] font-medium transition-colors hover:bg-gray-50"
          style={{
            borderColor: authTokens.fieldBorder,
            color: authTokens.titleColor,
          }}
          aria-label="Continue with Google"
        >
          <img src={GoogleLogo} alt="" className="h-5 w-5 shrink-0" />
          Google
        </button>

        <button
          type="button"
          onClick={
            onApple ??
            (() => alert('Apple sign-in will be wired when the API is ready.'))
          }
          className="flex-1 flex items-center justify-center gap-2.5 h-[48px] rounded-lg border bg-white text-[14px] font-medium transition-colors hover:bg-gray-50"
          style={{
            borderColor: authTokens.fieldBorder,
            color: authTokens.titleColor,
          }}
          aria-label="Continue with Apple"
        >
          <img src={AppleLogo} alt="" className="h-5 w-5 shrink-0" />
          Apple
        </button>
      </div>
    </>
  );
};

type AuthSplitPageProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  hideBrandLogo?: boolean;
};

export const AuthSplitPage: React.FC<AuthSplitPageProps> = ({
  children,
  footer,
  wide = false,
  hideBrandLogo = false,
}) => (
  <div className="flex min-h-screen w-full bg-white">
    <AuthRightPanel footer={footer} wide={wide} hideBrandLogo={hideBrandLogo}>
      {children}
    </AuthRightPanel>
    <AuthSplitLeftPanel />
  </div>
);
