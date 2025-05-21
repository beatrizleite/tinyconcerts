import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders React + Flask header', () => {
  render(<App />);
  const headerElement = screen.getByText(/React \+ Flask/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders loading message initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading.../i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders image with correct alt text', () => {
  render(<App />);
  const imageElement = screen.getByAltText(/gatinho curtindo dum beat/i);
  expect(imageElement).toBeInTheDocument();
});

