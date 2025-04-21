import { createBrowserRouter, Navigate } from 'react-router-dom';

// Auth Components
import EmployerLoginForm from '../components/auth/employer/LoginForm';
import EmployerSignupForm from '../components/auth/employer/SignupFrom';
import EmployerSignupOTP from '../components/auth/employer/SignupOTP';
import EmployerSignupPassword from '../components/auth/employer/SignupPassword';
import EmployerSigninPassword from '../components/auth/employer/SigninPassword';
import EmployerSigninCreatePassword from '../components/auth/employer/SigninCreatePassword';
import EmployeeLoginForm from '../components/auth/employee/LoginForm';
import EmployeeOTP from '../components/auth/employee/OTP';
import EmployerForgotPassword from '../components/auth/employer/ForgotPassword';
import EmployerForgotPasswordOTP from '../components/auth/employer/ForgotPasswordOTP';
import AgentLoginForm from '../components/auth/agent/LoginForm';
import OnboardingForm from '../components/auth/employer/OnboardingForm';
import NotificationsPage from '../components/Employer/NotificationsPage';

// Dashboard Components
import EmployerDashboard from '../pages/employer/Dashboard';
import EmployeeDashboard from '../pages/employee/Dashboard';
import AgentDashboard from '../pages/agent/Dashboard';
import FacialCapturePage from '../components/auth/employer/FacialCapture';
import EmployeeFacialCapturePage from '../components/auth/employee/FacialCapture';
import CreatePassword from '../components/auth/employee/CreatePassword';

// Layouts
import EmployerLayout from '../components/layouts/Employer/Layout';
import EmployeeLayout from '../components/layouts/Employee/Layout';
import AgentLayout from '../components/layouts/Agent/Layout'
import WalletPage from '../pages/employer/WalletPage';
import WalletHistory from '../pages/employer/WalletHistory';
import WalletTopUp from '../pages/employer/WalletTopUp';
import Profile from '../pages/employer/Profile';
import Security from '../pages/employer/Security';
import KYCPage from '../pages/employer/KYCPage';
import AritisansPage from '../pages/employer/AritisansPage';
import ArtisanProfileView from '../pages/employer/ArtisansProfile';
import Staff from '../pages/employer/Staff';
import Payroll from '../pages/employer/Payroll';
import AllPayroll from '../pages/employer/AllPayroll';
import StaffProfile from '../pages/employer/StaffProfile';
import Resources from '../pages/employer/Resources';
import EmployeeResources from '../pages/employee/Resources';
import Medical from '../pages/employer/Medical';
import ReviewsPage from '../pages/employer/Reviews';
import Contracts from '../pages/employer/Contracts';
import HomesafeForgotPasswordPage from '../components/auth/employee/ForgotPassword';
import Salary from '../pages/employee/Salary';
import EmployeeMedical from '../pages/employee/Medical';
import EmployeeReview from '../pages/employee/Review';
import EmployeeContracts from '../pages/employee/Contracts';
import CandidatesPage from '../pages/agent/Candidates';
import AllCandidatesPage from '../pages/agent/AllCandidatesPage';
import Track from '../pages/agent/Track';
import Review from '../pages/agent/Review';

// Landing Page Compoents
import Home from '../pages/Landing Page/Home'
import About from '../pages/Landing Page/About'
import Artisans from '../pages/Landing Page/Artisans';
import Support from '../pages/Landing Page/Support';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: 'about',
    element: <About />,
  },
  {
    path: 'artisans',
    element: <Artisans />,
  },
  {
    path: 'support',
    element: <Support />,
  },
  // Employer Routes
  {
    path: '/employer',
    children: [
      {
        path: '',
        element: <Navigate to="/employer/login" replace />,
      },
      {
        path: 'login',
        element: <EmployerLoginForm />,
      },
      {
        path: 'signup',
        element: <EmployerSignupForm />,
      },
      {
        path: 'signup/otp',
        element: <EmployerSignupOTP />,
      },
      {
        path: 'forgot-password/otp',
        element: <EmployerForgotPasswordOTP />,
      },
      {
        path: 'signup/password',
        element: <EmployerSignupPassword />,
      },
      {
        path: 'signup/onboarding-form',
        element: <OnboardingForm />,
      },
      {
        path: 'signup/facial-capture',
        element: <FacialCapturePage />,
      },
      {
        path: 'signin/password',
        element: <EmployerSigninPassword />,
      },
      {
        path: 'signin/forgot-password',
        element: <EmployerForgotPassword />,
      },
      {
        path: 'signin/create-password',
        element: <EmployerSigninCreatePassword />,
      },
      {
        path: 'dashboard',
        element: (
          <EmployerLayout>
            <EmployerDashboard />
          </EmployerLayout>
        ),
      },
      {
        path: 'profile',
        element: (
          <EmployerLayout>
            <Profile />
          </EmployerLayout>
        ),
      },
      {
        path: 'security',
        element: (
          <EmployerLayout>
            <Security />
          </EmployerLayout>
        ),
      },
      {
        path: 'kyc',
        element: (
          <EmployerLayout>
            <KYCPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'notifications',
        element: (
          <EmployerLayout>
            <NotificationsPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'wallet',
        element: (
          <EmployerLayout>
            <WalletPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'wallet-history',
        element: (
          <EmployerLayout>
            <WalletHistory />
          </EmployerLayout>
        ),
      },
      {
        path: 'wallet/top-up',
        element: (
          <EmployerLayout>
            <WalletTopUp />
          </EmployerLayout>
        ),
      },
      {
        path: 'artisans',
        element: (
          <EmployerLayout>
            <AritisansPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'artisan/profile',
        element: (
          <EmployerLayout>
            <ArtisanProfileView goBack={() => window.history.back()} />
          </EmployerLayout>
        ),
      },
      {
        path: 'staff',
        element: (
          <EmployerLayout>
            <Staff />
          </EmployerLayout>
        ),
      },
      {
        path: 'staff/profile',
        element: (
          <EmployerLayout>
            <StaffProfile />
          </EmployerLayout>
        ),
      },
      {
        path: 'payroll',
        element: (
          <EmployerLayout>
            <Payroll />
          </EmployerLayout>
        ),
      },
      {
        path: 'payroll/all',
        element: (
          <EmployerLayout>
            <AllPayroll />
          </EmployerLayout>
        ),
      },
      {
        path: 'resources',
        element: (
          <EmployerLayout>
            <Resources />
          </EmployerLayout>
        ),
      },
      {
        path: 'medical',
        element: (
          <EmployerLayout>
            <Medical />
          </EmployerLayout>
        ),
      },
      {
        path: 'review',
        element: (
          <EmployerLayout>
            <ReviewsPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'contracts',
        element: (
          <EmployerLayout>
            <Contracts />
          </EmployerLayout>
        ),
      },
    ],
  },
  // Employee Routes
  {
    path: '/employee',
    children: [
      {
        path: '',
        element: <Navigate to="/employee/login" replace />,
      },
      {
        path: 'login',
        element: <EmployeeLoginForm />,
      },
      {
        path: 'login/facial-capture',
        element: <EmployeeFacialCapturePage />,
      },
      {
        path: 'forgot-password',
        element: <HomesafeForgotPasswordPage />,
      },
      {
        path: 'forgot-password/otp',
        element: <EmployeeOTP />,
      },
      {
        path: 'create-password',
        element: <CreatePassword />,
      },
      {
        path: 'dashboard',
        element: (
          <EmployeeLayout>
            <EmployeeDashboard />
          </EmployeeLayout>
        ),
      },
      {
        path: 'salary',
        element: (
          <EmployeeLayout>
            <Salary />
          </EmployeeLayout>
        ),
      },
      {
        path: 'resources',
        element: (
          <EmployeeLayout>
            <EmployeeResources />
          </EmployeeLayout>
        ),
      },
      {
        path: 'medical',
        element: (
          <EmployeeLayout>
            <EmployeeMedical />
          </EmployeeLayout>
        ),
      },
      {
        path: 'review',
        element: (
          <EmployeeLayout>
            <EmployeeReview />
          </EmployeeLayout>
        ),
      },
      {
        path: 'contracts',
        element: (
          <EmployeeLayout>
            <EmployeeContracts />
          </EmployeeLayout>
        ),
      },
    ],
  },
  // Agent Routes
  {
    path: '/agent',
    children: [
      {
        path: '',
        element: <Navigate to="/agent/login" replace />,
      },
      {
        path: 'login',
        element: <AgentLoginForm />,
      },
      {
        path: 'dashboard',
        element: (
          <AgentLayout>
        <AgentDashboard />,
        </AgentLayout>
        )
      },
      {
        path: 'candidates',
        element: (
          <AgentLayout>
            <CandidatesPage />
          </AgentLayout>
        ),
      },
      {
        path: 'track',
        element: (
          <AgentLayout>
            <Track />
          </AgentLayout>
        ),
      },
      {
        path: 'review',
        element: (
          <AgentLayout>
            <Review />
          </AgentLayout>
        ),
      },
      {
        path: 'all-candidates',
        element: (
          <AgentLayout>
            <AllCandidatesPage />
          </AgentLayout>
        ),
      },
    ],
  },
]);
