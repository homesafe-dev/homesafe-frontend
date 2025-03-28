import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import HomesafeSigninCreatePasswordPage from '../../src/components/auth/employee/CreatePassword';

// Test suite for auth components
describe('CreatePassword Component', () => {
  // Helper function to wrap components with router
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  it('should render create password form with all required elements', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);
    
    // Check for heading
    expect(screen.getByText('Create Password')).toBeInTheDocument();
    
    // Check for password input
    const passwordInput = screen.getByPlaceholderText('*******');
    expect(passwordInput).toBeInTheDocument();
    
    // Check for password requirements text
    expect(screen.getByText(/Password must be 8 letters long/)).toBeInTheDocument();
    
    // Check for continue button
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('should toggle password visibility when eye icon is clicked', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);
    
    const passwordInput = screen.getByPlaceholderText('*******') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');
    
    // Click toggle button
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    // Click toggle button again
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should update password value in UI when typing', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);
    
    const passwordInput = screen.getByPlaceholderText('*******') as HTMLInputElement;
    const testPassword = 'TestPass123!';
    
    fireEvent.change(passwordInput, { target: { value: testPassword } });
    expect(passwordInput.value).toBe(testPassword);
  });

  it('should show password requirements text', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);
    
    const requirementsText = screen.getByText(/Password must be 8 letters long and should contain special characters & numbers/);
    expect(requirementsText).toBeInTheDocument();
  });

  it('should show mission statement and logo in the left panel', () => {
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);
    
    // Check for mission statement
    const missionText = screen.getByText(/Our Mission at Homesafe is to make hiring safe/);
    expect(missionText).toBeInTheDocument();
    
    // Check for logo
    const logo = screen.getByAltText('Homesafe Logo');
    expect(logo).toBeInTheDocument();
  });

  // Updated form submission test
  it('should handle form submission', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderWithRouter(<HomesafeSigninCreatePasswordPage />);
    
    const form = screen.getByRole('form');
    const passwordInput = screen.getByPlaceholderText('*******');
    
    // Type password
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    
    // Submit the form directly instead of clicking the button
    fireEvent.submit(form);
    
    // Verify console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Password submitted:', 'SecurePass123!');
    
    consoleSpy.mockRestore();
  });
}); 