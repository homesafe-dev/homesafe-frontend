import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct Tailwind classes', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveClass('text-white');
  });
});
