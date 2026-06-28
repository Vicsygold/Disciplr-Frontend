import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Vaults from '../../pages/Vaults';

// Helper to mock fetch function
const mockSuccess = <T,>(data: T) => vi.fn().mockResolvedValue(data);
const mockFailure = (message = 'Network error') => vi.fn().mockRejectedValue(new Error(message));

describe('Vaults page states', () => {
  test('shows loading skeletons initially', async () => {
    render(<Vaults fetchVaults={mockSuccess([])} />);
    // Skeletons should be present immediately
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
    // Wait for loading to finish (no data)
    await waitFor(() => expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument());
  });

  test('shows empty state when no vaults', async () => {
    render(<Vaults fetchVaults={mockSuccess([])} />);
    await waitFor(() => screen.getByText(/You don’t have any vaults yet./i));
    expect(screen.getByRole('link', { name: /Create your first vault/i })).toBeInTheDocument();
  });

  test('shows data state when vaults exist', async () => {
    const mockData = [
      { id: '1', name: 'Test Vault', amount: 1000, currency: 'USDC', status: 'active' as any, deadline: '2025-01-01T00:00:00Z' },
    ];
    render(<Vaults fetchVaults={mockSuccess(mockData)} />);
    await waitFor(() => screen.getByText('Test Vault'));
    expect(screen.getByText(/Test Vault/i)).toBeInTheDocument();
  });

  test('shows error state and can retry', async () => {
    const fetchMock = mockFailure();
    render(<Vaults fetchVaults={fetchMock} />);
    await waitFor(() => screen.getByText(/Failed to load vaults./i));
    const retryBtn = screen.getByRole('button', { name: /Retry/i });
    expect(retryBtn).toBeInTheDocument();
    // Mock success on retry
    fetchMock.mockImplementationOnce(() => Promise.resolve([]));
    userEvent.click(retryBtn);
    await waitFor(() => screen.getByText(/You don’t have any vaults yet./i));
  });
});
