import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the Homesafe App heading', () => {
    render(<Home />);

    // Check if the heading is rendered
    const heading = screen.getByRole('heading', { name: /Homesafe App/i });
    expect(heading).toBeInTheDocument();
  });
});