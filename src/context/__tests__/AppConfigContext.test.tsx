import { render, screen } from '@testing-library/react';
import { AppConfigProvider, useAppConfig } from '../AppConfigContext';
import { EXPLORER_BASE_URLS, HORIZON_URLS, USDC_ISSUERS } from '../../utils/horizon';
import type { WalletNetwork } from '../WalletContext';

const walletMockState = vi.hoisted(() => ({
    network: null as WalletNetwork | null,
}));

vi.mock('../WalletContext', () => ({
    useWallet: () => ({
        network: walletMockState.network,
    }),
}));

function AppConfigProbe() {
    const config = useAppConfig();

    return (
        <div>
            <div data-testid="network">{config.network}</div>
            <div data-testid="horizonUrl">{config.horizonUrl}</div>
            <div data-testid="usdcIssuer">{config.usdcIssuer}</div>
            <div data-testid="explorerBaseUrl">{config.explorerBaseUrl}</div>
        </div>
    );
}

function UnsafeProbe() {
    useAppConfig();
    return null;
}

describe('AppConfigContext', () => {
    beforeEach(() => {
        walletMockState.network = null;
    });

    test('uses TESTNET defaults while wallet is disconnected', () => {
        render(
            <AppConfigProvider>
                <AppConfigProbe />
            </AppConfigProvider>,
        );

        expect(screen.getByTestId('network')).toHaveTextContent('TESTNET');
        expect(screen.getByTestId('horizonUrl')).toHaveTextContent(HORIZON_URLS.TESTNET);
        expect(screen.getByTestId('usdcIssuer')).toHaveTextContent(USDC_ISSUERS.TESTNET);
        expect(screen.getByTestId('explorerBaseUrl')).toHaveTextContent(EXPLORER_BASE_URLS.TESTNET);
    });

    test('updates derived config values when wallet network changes', () => {
        const { rerender } = render(
            <AppConfigProvider>
                <AppConfigProbe />
            </AppConfigProvider>,
        );

        walletMockState.network = 'PUBLIC';

        rerender(
            <AppConfigProvider>
                <AppConfigProbe />
            </AppConfigProvider>,
        );

        expect(screen.getByTestId('network')).toHaveTextContent('PUBLIC');
        expect(screen.getByTestId('horizonUrl')).toHaveTextContent(HORIZON_URLS.PUBLIC);
        expect(screen.getByTestId('usdcIssuer')).toHaveTextContent(USDC_ISSUERS.PUBLIC);
        expect(screen.getByTestId('explorerBaseUrl')).toHaveTextContent(EXPLORER_BASE_URLS.PUBLIC);
    });

    test('throws when useAppConfig is rendered outside the provider', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(<UnsafeProbe />)).toThrow('useAppConfig must be used within an AppConfigProvider');

        error.mockRestore();
    });
});
