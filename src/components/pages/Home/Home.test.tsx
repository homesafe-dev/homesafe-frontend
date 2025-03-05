import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { expect, test } from 'vitest';

test('renders Home page', () => {
  render(<Home />);
  const headingElement = screen.getByText(/Homesafe App/i);
  expect(headingElement).toBeInTheDocument();
});
