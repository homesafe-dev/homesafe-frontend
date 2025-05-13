import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ReactNode } from 'react';
import { UserType } from '../contexts/types';

// Helper functions to protect routes by role
const protectRoute = (element: ReactNode, allowedRoles: UserType[]) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
);

const protectEmployerRoute = (element: ReactNode) =>
  protectRoute(element, ['employer']);
const protectEmployeeRoute = (element: ReactNode) =>
  protectRoute(element, ['employee']);
const protectAgentRoute = (element: ReactNode) =>
  protectRoute(element, ['agent']);

// Auth Components
import EmployerLoginForm from '../components/auth/employer/LoginForm';
import EmployerSignupForm from '../components/auth/employer/SignupFrom';
import EmployerSignupOTP from '../components/auth/employer/SignupOTP';
import EmployerSignupPassword from '../components/auth/employer/SignupPassword';
import EmployerSigninPassword from '../components/auth/employer/SigninPassword';
import EmployerSigninCreatePassword from '../components/auth/employer/SigninCreatePassword';
// Removed unused imports: EmployeeLoginForm, EmployeeOTP, AgentLoginForm
import EmployerForgotPassword from '../components/auth/employer/ForgotPassword';
import EmployerForgotPasswordOTP from '../components/auth/employer/ForgotPasswordOTP';
import EmployerResetPassword from '../components/auth/employer/ResetPassword';
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
import AgentLayout from '../components/layouts/Agent/Layout';
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
// Removed unused import: HomesafeForgotPasswordPage
import Salary from '../pages/employee/Salary';
import EmployeeMedical from '../pages/employee/Medical';
import EmployeeReview from '../pages/employee/Review';
import EmployeeContracts from '../pages/employee/Contracts';
import EmployeeProfilePage from '../pages/employee/Profile';
import EmployeeSecurityPage from '../pages/employee/Security';
import EmployeeKYCPage from '../pages/employee/KYCPage';
import CandidatesPage from '../pages/agent/Candidates';
import AllCandidatesPage from '../pages/agent/AllCandidatesPage';
import Track from '../pages/agent/Track';
import Review from '../pages/agent/Review';
import CandidateProfile from '../pages/agent/CandidateProfile';
import AgentProfile from '../pages/agent/Profile';
import AgentSecurity from '../pages/agent/Security';
import AgentKYCPage from '../pages/agent/KYCPage';

// Landing Page Compoents
import Home from '../pages/Landing Page/Home';
import About from '../pages/Landing Page/About';
import Artisans from '../pages/Landing Page/Artisans';
import Support from '../pages/Landing Page/Support';
import TestPage from '../pages/TestPage';

export const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <Navigate to="/home" replace />,
  // },
  {
    path: '/',
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
  {
    path: 'test',
    element: <TestPage />,
  },
  {
    path: 'protected-test',
    element: (
      <ProtectedRoute allowedRoles={['employer', 'employee', 'agent']}>
        <TestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'employer-only',
    element: protectEmployerRoute(<TestPage />),
  },
  {
    path: 'employee-only',
    element: protectEmployeeRoute(<TestPage />),
  },
  {
    path: 'agent-only',
    element: protectAgentRoute(<TestPage />),
  },
  // Auth Routes (shared across all user types at top level)
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
    path: 'reset-password',
    element: <EmployerResetPassword />,
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
  // Employer Routes
  {
    path: '/employer',
    children: [
      {
        path: '',
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'dashboard',
        element: protectEmployerRoute(
          <EmployerLayout>
            <EmployerDashboard />
          </EmployerLayout>
        ),
      },
      {
        path: 'profile',
        element: protectEmployerRoute(
          <EmployerLayout>
            <Profile />
          </EmployerLayout>
        ),
      },
      {
        path: 'security',
        element: protectEmployerRoute(
          <EmployerLayout>
            <Security />
          </EmployerLayout>
        ),
      },
      {
        path: 'kyc',
        element: protectEmployerRoute(
          <EmployerLayout>
            <KYCPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'notifications',
        element: protectEmployerRoute(
          <EmployerLayout>
            <NotificationsPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'wallet',
        element: protectEmployerRoute(
          <EmployerLayout>
            <WalletPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'wallet-history',
        element: protectEmployerRoute(
          <EmployerLayout>
            <WalletHistory />
          </EmployerLayout>
        ),
      },
      {
        path: 'wallet/top-up',
        element: protectEmployerRoute(
          <EmployerLayout>
            <WalletTopUp />
          </EmployerLayout>
        ),
      },
      {
        path: 'artisans',
        element: protectEmployerRoute(
          <EmployerLayout>
            <AritisansPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'artisan/profile',
        element: protectEmployerRoute(
          <EmployerLayout>
            <ArtisanProfileView />
          </EmployerLayout>
        ),
      },
      {
        path: 'staff',
        element: protectEmployerRoute(
          <EmployerLayout>
            <Staff />
          </EmployerLayout>
        ),
      },
      {
        path: 'staff/profile',
        element: protectEmployerRoute(
          <EmployerLayout>
            <StaffProfile />
          </EmployerLayout>
        ),
      },
      {
        path: 'payroll',
        element: protectEmployerRoute(
          <EmployerLayout>
            <Payroll />
          </EmployerLayout>
        ),
      },
      {
        path: 'payroll/all',
        element: protectEmployerRoute(
          <EmployerLayout>
            <AllPayroll />
          </EmployerLayout>
        ),
      },
      {
        path: 'resources',
        element: protectEmployerRoute(
          <EmployerLayout>
            <Resources />
          </EmployerLayout>
        ),
      },
      {
        path: 'medical',
        element: protectEmployerRoute(
          <EmployerLayout>
            <Medical />
          </EmployerLayout>
        ),
      },
      {
        path: 'review',
        element: protectEmployerRoute(
          <EmployerLayout>
            <ReviewsPage />
          </EmployerLayout>
        ),
      },
      {
        path: 'contracts',
        element: protectEmployerRoute(
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
        element: <Navigate to="/login" replace />,
      },
      // Keep these specific employee auth routes
      {
        path: 'login/facial-capture',
        element: <EmployeeFacialCapturePage />,
      },
      {
        path: 'create-password',
        element: <CreatePassword />,
      },
      {
        path: 'dashboard',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeDashboard />
          </EmployeeLayout>
        ),
      },
      {
        path: 'profile',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeProfilePage />
          </EmployeeLayout>
        ),
      },
      {
        path: 'security',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeSecurityPage />
          </EmployeeLayout>
        ),
      },
      {
        path: 'kyc',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeKYCPage />
          </EmployeeLayout>
        ),
      },
      {
        path: 'salary',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <Salary />
          </EmployeeLayout>
        ),
      },
      {
        path: 'resources',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeResources />
          </EmployeeLayout>
        ),
      },
      {
        path: 'medical',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeMedical />
          </EmployeeLayout>
        ),
      },
      {
        path: 'review',
        element: protectEmployeeRoute(
          <EmployeeLayout>
            <EmployeeReview />
          </EmployeeLayout>
        ),
      },
      {
        path: 'contracts',
        element: protectEmployeeRoute(
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
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'dashboard',
        element: protectAgentRoute(
          <AgentLayout>
            <AgentDashboard />
          </AgentLayout>
        ),
      },
      {
        path: 'candidates',
        element: protectAgentRoute(
          <AgentLayout>
            <CandidatesPage />
          </AgentLayout>
        ),
      },
      {
        path: 'add-candidate',
        element: protectAgentRoute(
          <AgentLayout>
            <CandidatesPage />
          </AgentLayout>
        ),
      },
      {
        path: 'track',
        element: protectAgentRoute(
          <AgentLayout>
            <Track />
          </AgentLayout>
        ),
      },
      {
        path: 'review',
        element: protectAgentRoute(
          <AgentLayout>
            <Review />
          </AgentLayout>
        ),
      },
      {
        path: 'all-candidates',
        element: protectAgentRoute(
          <AgentLayout>
            <AllCandidatesPage />
          </AgentLayout>
        ),
      },
      {
        path: 'candidate-profile/:id',
        element: protectAgentRoute(
          <AgentLayout>
            <CandidateProfile />
          </AgentLayout>
        ),
      },
      {
        path: 'profile',
        element: protectAgentRoute(
          <AgentLayout>
            <AgentProfile />
          </AgentLayout>
        ),
      },
      {
        path: 'security',
        element: protectAgentRoute(
          <AgentLayout>
            <AgentSecurity />
          </AgentLayout>
        ),
      },
      {
        path: 'kyc',
        element: protectAgentRoute(
          <AgentLayout>
            <AgentKYCPage />
          </AgentLayout>
        ),
      },
    ],
  },
]);
