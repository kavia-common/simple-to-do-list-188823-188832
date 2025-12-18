import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the to-do header', () => {
  render(<App />);
  // The UI uses a non-breaking hyphen in "To‑Do", so match either that or a normal hyphen.
  const header = screen.getByRole('heading', { name: /to[\u2011-]do list/i, level: 1 });
  expect(header).toBeInTheDocument();
});
