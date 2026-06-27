const EXPLORER_BASE = 'https://stellar.expert/explorer'

export function getExplorerTxUrl(txHash: string, network: 'TESTNET' | 'PUBLIC' | null): string {
  const segment = network === 'PUBLIC' ? 'public' : 'testnet'
  return `${EXPLORER_BASE}/${segment}/tx/${txHash}`
}

export function getExplorerAccountUrl(address: string, network: 'TESTNET' | 'PUBLIC' | null): string {
  const segment = network === 'PUBLIC' ? 'public' : 'testnet'
  return `${EXPLORER_BASE}/${segment}/account/${address}`
}
