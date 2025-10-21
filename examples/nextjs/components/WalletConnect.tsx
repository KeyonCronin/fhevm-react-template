'use client';

interface WalletConnectProps {
  account: string | null;
  isConnected: boolean;
  onConnect: () => void;
}

export default function WalletConnect({ account, isConnected, onConnect }: WalletConnectProps) {
  return (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
      <h3>Wallet Connection</h3>
      {isConnected && account ? (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Connected:</strong></p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{account}</p>
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <p>Connect your wallet to get started</p>
          <button onClick={onConnect} style={{ marginTop: '1rem' }}>
            Connect MetaMask
          </button>
        </div>
      )}
    </div>
  );
}
