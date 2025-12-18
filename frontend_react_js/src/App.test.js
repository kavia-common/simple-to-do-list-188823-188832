import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the to-do header', () => {
  render(<App />);
  const header = screen.getByRole('heading', { name: /to-do list/i });
  expect(header).toBeInTheDocument();
});
