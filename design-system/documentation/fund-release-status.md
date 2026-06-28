# FundReleaseStatus

`FundReleaseStatus` communicates where locked vault funds went after settlement. It gives vault owners and verifiers a single panel for the outcome, destination, amount, settlement timestamp, and Stellar transaction proof.

## Outcomes

| Outcome | Meaning | Token |
| --- | --- | --- |
| `released` | Funds were released to the success destination. | `--success` |
| `redirected` | Funds were redirected to the failure destination. | `--danger` |
| `pending` | Funds are still locked and no settlement transaction exists yet. | `--warning` |

Each outcome includes both icon and text, so the state is not conveyed by color alone.

## Accessibility

- Long destination addresses and transaction hashes are visually truncated.
- The full destination is preserved in `title` and `aria-label`.
- Transaction links include the full hash and the active Stellar network in their accessible label.

## Explorer Links

The component reads `network` from `WalletContext`:

- `TESTNET` links to `https://stellar.expert/explorer/testnet/tx/{hash}`.
- `PUBLIC` links to `https://stellar.expert/explorer/public/tx/{hash}`.
- A missing network falls back to TESTNET for safer development defaults.
