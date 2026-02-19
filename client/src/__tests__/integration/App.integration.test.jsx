import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../../App';

// We use MemoryRouter with initial entries to simulate each route
const renderAtRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        {/* Mirror App routes so we can test individual pages */}
      </Routes>
    </MemoryRouter>
  );

describe('App Integration — Route Rendering', () => {
  it('renders Navbar on the home route (/)', () => {
    // App uses BrowserRouter internally — render directly, no extra router wrapper
    render(<App />);
    expect(screen.getByText('SHOPSMART')).toBeInTheDocument();
  });

  it('home route (/) renders Hero heading', () => {
    render(<App />);
    expect(screen.getByText(/unleash your style/i)).toBeInTheDocument();
  });

  it('Navbar is rendered on the home page', () => {
    render(<App />);
    expect(screen.getByText('SHOPSMART')).toBeInTheDocument();
  });

  it('"About Us" link points to /about', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /about us/i });
    expect(link).toHaveAttribute('href', '/about');
  });

  it('"Blog" link points to /blog', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /blog/i });
    expect(link).toHaveAttribute('href', '/blog');
  });

  it('"FAQ" link points to /faq', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /faq/i });
    expect(link).toHaveAttribute('href', '/faq');
  });

  it('Cart link points to /cart', () => {
    render(<App />);
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('Profile link points to /profile', () => {
    render(<App />);
    const profileLink = screen.getByRole('link', { name: /profile/i });
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('Collections link points to /collections', () => {
    render(<App />);
    const collectionsLinks = screen.getAllByRole('link', { name: /clothing/i });
    expect(collectionsLinks[0]).toHaveAttribute('href', '/collections');
  });

  it('renders the shop now button on the home page', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /shop now/i })).toBeInTheDocument();
  });
});
