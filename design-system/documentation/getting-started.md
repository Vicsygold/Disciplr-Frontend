# Getting Started

## RequireWallet

`RequireWallet` is a route guard component that gates wallet-dependent routes behind a connect prompt.

### Behaviour

| Wallet state | Renders |
|---|---|
| `address` is truthy | `children` |
| `address` is `null` | Connect prompt with `WalletConnectButton` |
| `isConnecting` is `true` | Connect prompt + "Connecting…" status message |

The prompt is wrapped in a `role="main"` landmark labelled by its heading, satisfying WCAG 2.1 AA landmark requirements.

The intended destination path is stored in a hidden `<input>` so calling code can redirect the user after a successful connection.

### Usage

Wrap any route element that requires a connected wallet:

```tsx
import RequireWallet from './components/RequireWallet';

<Route
  path="/vaults/create"
  element={
    <RequireWallet>
      <CreateVault />
    </RequireWallet>
  }
/>
```

### Props

| Prop | Type | Description |
|---|---|---|
| `children` | `React.ReactNode` | Content rendered when wallet is connected |

### Testing

```bash
npm test                   # run all tests
npm run test:coverage      # run with coverage report
```

The component ships with 100 % branch coverage. Mocking pattern:

```ts
vi.mock('../../context/WalletContext', () => ({
  useWallet: () => ({ address: 'GADDR…', isConnecting: false }),
}));
```
