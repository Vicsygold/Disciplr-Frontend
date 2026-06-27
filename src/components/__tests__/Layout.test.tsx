import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

vi.mock('../Wallet/WalletConnectButton', () => ({
  WalletConnectButton: () => <button type="button">Connect wallet</button>,
}));

// MobileDrawer uses FocusTrap only when open; mock it so any accidental open
// in these tests doesn't break due to missing DOM focus targets.
vi.mock('focus-trap-react', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

function renderLayout(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Layout>
        <div>Page content</div>
      </Layout>
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Existing regression tests — must keep passing
// ---------------------------------------------------------------------------
describe('Layout component navigation', () => {
  test('transactions link receives active class and aria-current when on /transactions', () => {
    renderLayout('/transactions');
    const link = screen.getByRole('link', { name: /transactions/i });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  test('transactions link is not active on other routes', () => {
    renderLayout('/');
    const link = screen.getByRole('link', { name: /transactions/i });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveClass('active');
  });
});

// ---------------------------------------------------------------------------
// Landmark assertions
// ---------------------------------------------------------------------------
describe('Layout header landmarks', () => {
  test('page has a banner landmark (header element)', () => {
    renderLayout('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('desktop nav is a navigation landmark with an accessible name', () => {
    renderLayout('/');
    expect(
      screen.getByRole('navigation', { name: /main navigation/i }),
    ).toBeInTheDocument();
  });

  test('page has a main landmark', () => {
    renderLayout('/');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessible-name assertions for every interactive control
// ---------------------------------------------------------------------------
describe('Layout nav link and control accessible names', () => {
  test('brand home link has accessible name "Disciplr home"', () => {
    renderLayout('/');
    expect(
      screen.getByRole('link', { name: /disciplr home/i }),
    ).toBeInTheDocument();
  });

  test('brand Transactions link has accessible name', () => {
    renderLayout('/');
    expect(
      screen.getByRole('link', { name: /^transactions$/i }),
    ).toBeInTheDocument();
  });

  test('desktop nav Home link has accessible name', () => {
    renderLayout('/');
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
  });

  test('desktop nav Analytics link has accessible name', () => {
    renderLayout('/');
    expect(
      screen.getByRole('link', { name: /^analytics$/i }),
    ).toBeInTheDocument();
  });

  test('desktop nav Create Vault link has accessible name', () => {
    renderLayout('/');
    expect(
      screen.getByRole('link', { name: /^create vault$/i }),
    ).toBeInTheDocument();
  });

  test('every link inside the desktop nav has a non-empty accessible name', () => {
    renderLayout('/');
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const links = nav.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      // accessible name comes from text content or aria-label
      const name =
        link.getAttribute('aria-label') ?? link.textContent?.trim() ?? '';
      expect(name.length).toBeGreaterThan(0);
    });
  });

  test('mobile hamburger button has accessible name', () => {
    renderLayout('/');
    expect(
      screen.getByRole('button', { name: /open navigation menu/i }),
    ).toBeInTheDocument();
  });

  test('wallet connect button has accessible name', () => {
    renderLayout('/');
    expect(
      screen.getByRole('button', { name: /connect wallet/i }),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// aria-current="page" per route — only one link active at a time
// ---------------------------------------------------------------------------
describe('Layout nav aria-current per route', () => {
  test('Home link has aria-current="page" on "/"', () => {
    renderLayout('/');
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('no other desktop-nav link is active on "/"', () => {
    renderLayout('/');
    expect(
      screen.getByRole('link', { name: /^analytics$/i }),
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getByRole('link', { name: /^create vault$/i }),
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getByRole('link', { name: /^transactions$/i }),
    ).not.toHaveAttribute('aria-current');
  });

  test('Analytics link has aria-current="page" on "/analytics"', () => {
    renderLayout('/analytics');
    expect(
      screen.getByRole('link', { name: /^analytics$/i }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('no other link is active on "/analytics"', () => {
    renderLayout('/analytics');
    expect(screen.getByRole('link', { name: /^home$/i })).not.toHaveAttribute(
      'aria-current',
    );
    expect(
      screen.getByRole('link', { name: /^create vault$/i }),
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getByRole('link', { name: /^transactions$/i }),
    ).not.toHaveAttribute('aria-current');
  });

  test('Transactions link has aria-current="page" on "/transactions"', () => {
    renderLayout('/transactions');
    expect(
      screen.getByRole('link', { name: /^transactions$/i }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('no other link is active on "/transactions"', () => {
    renderLayout('/transactions');
    expect(screen.getByRole('link', { name: /^home$/i })).not.toHaveAttribute(
      'aria-current',
    );
    expect(
      screen.getByRole('link', { name: /^analytics$/i }),
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getByRole('link', { name: /^create vault$/i }),
    ).not.toHaveAttribute('aria-current');
  });

  test('Create Vault link has aria-current="page" on "/vaults/create"', () => {
    renderLayout('/vaults/create');
    expect(
      screen.getByRole('link', { name: /^create vault$/i }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('no other link is active on "/vaults/create"', () => {
    renderLayout('/vaults/create');
    expect(screen.getByRole('link', { name: /^home$/i })).not.toHaveAttribute(
      'aria-current',
    );
    expect(
      screen.getByRole('link', { name: /^analytics$/i }),
    ).not.toHaveAttribute('aria-current');
    expect(
      screen.getByRole('link', { name: /^transactions$/i }),
    ).not.toHaveAttribute('aria-current');
  });

  test('exactly one link carries aria-current="page" for each primary route', () => {
    const routes = ['/', '/analytics', '/transactions', '/vaults/create'];

    routes.forEach((path) => {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <Layout>
            <div />
          </Layout>
        </MemoryRouter>,
      );

      const activeLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('aria-current') === 'page');

      expect(activeLinks).toHaveLength(1);
      unmount();
    });
  });

  test('no link has aria-current on an unknown route', () => {
    renderLayout('/some/unknown/path');
    const activeLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    expect(activeLinks).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Mobile nav — hamburger wires up correctly to the drawer
// ---------------------------------------------------------------------------
describe('Layout mobile nav controls', () => {
  test('hamburger button references the mobile drawer via aria-controls', () => {
    renderLayout('/');
    const btn = screen.getByRole('button', { name: /open navigation menu/i });
    expect(btn).toHaveAttribute('aria-controls', 'mobile-drawer');
  });

  test('hamburger button reports aria-expanded="false" when drawer is closed', () => {
    renderLayout('/');
    const btn = screen.getByRole('button', { name: /open navigation menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
