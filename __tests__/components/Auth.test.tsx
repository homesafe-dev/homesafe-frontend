import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import HomesafeSigninCreatePasswordPage from '../../src/components/auth/employee/CreatePassword';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreatePassword Component', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render create password form with all required elements', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);

    expect(screen.getByText('Create password')).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toBeInTheDocument();

    expect(
      screen.getByText(/Password must be 8 letters long/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /continue/i })
    ).toBeInTheDocument();
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);

    const passwordInput = screen.getByPlaceholderText(
      'Enter password'
    ) as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput.type).toBe('password');
  });

  it('should update password value in UI when typing', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);

    const passwordInput = screen.getByPlaceholderText(
      'Enter password'
    ) as HTMLInputElement;
    const testPassword = 'TestPass123!';

    fireEvent.change(passwordInput, { target: { value: testPassword } });
    expect(passwordInput.value).toBe(testPassword);
  });

  it('should show password requirements text', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);

    const requirementsText = screen.getByText(
      /Password must be 8 letters long and should contain special characters & numbers/
    );
    expect(requirementsText).toBeInTheDocument();
  });

  it('should show mission statement and logo in the left panel', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);

    const missionText = screen.getByText(
      /Our Mission at Homesafe is to make hiring safe/
    );
    expect(missionText).toBeInTheDocument();

    const logo = screen.getByAltText('Homesafe');
    expect(logo).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);

    const passwordInput = screen.getByPlaceholderText('Enter password');

    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/employee/dashboard');
  });
});
