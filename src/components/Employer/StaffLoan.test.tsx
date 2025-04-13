import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loan from './StaffLoan';

describe('Loan Component', () => {
  it('renders the no loan message', () => {
    render(<Loan />);

    expect(screen.getByText('Nothing Here')).toBeInTheDocument();
    expect(screen.getByText('This user has no loan')).toBeInTheDocument();
  });
});
