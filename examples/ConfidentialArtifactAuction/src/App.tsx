import { useState, useEffect } from 'react';
import { FhevmProvider, useFhevmClient, useEncrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';
import './App.css';

interface AuctionInfo {
  name: string;
  description: string;
  category: string;
  seller: string;
  startTime: bigint;
  endTime: bigint;
  minimumBid: bigint;
  isActive: boolean;
  authenticated: boolean;
  totalBids: bigint;
}

interface ArtifactDetails {
  name: string;
  description: string;
  category: string;
  yearCreated: bigint;
  provenance: string;
  authenticated: boolean;
}

interface AuctionResults {
  ended: boolean;
  winner: string;
  winningBid: bigint;
  totalBids: bigint;
}

const CONTRACT_ADDRESS = "0x7070e99539Ba0B0212CD3aC243033CA37eB07849";

const CONTRACT_ABI = [
  "function owner() view returns (address)",
  "function currentAuctionId() view returns (uint32)",
  "function createAuction(string memory _name, string memory _description, string memory _category, uint256 _minimumBid, uint256 _auctionDuration, uint256 _yearCreated, string memory _provenance) returns (uint32)",
  "function authenticateArtifact(uint32 auctionId)",
  "function placeBid(uint32 auctionId, bytes calldata encryptedBid)",
  "function endAuction(uint32 auctionId)",
  "function withdrawEarnings()",
  "function getAuctionInfo(uint32 auctionId) view returns (string memory name, string memory description, string memory category, address seller, uint256 startTime, uint256 endTime, uint256 minimumBid, bool isActive, bool authenticated, uint256 totalBids)",
  "function getArtifactDetails(uint32 auctionId) view returns (string memory name, string memory description, string memory category, uint256 yearCreated, string memory provenance, bool authenticated)",
  "function getBidStatus(uint32 auctionId, address bidder) view returns (bool hasActiveBid, uint256 bidTimestamp)",
  "function getAuctionResults(uint32 auctionId) view returns (bool ended, address winner, uint256 winningBid, uint256 totalBids)",
  "function getActiveAuctions() view returns (uint32[])",
  "function addAuthenticator(address _authenticator)",
  "function removeAuthenticator(address _authenticator)",
  "function authenticators(address) view returns (bool)",
  "event AuctionCreated(uint32 indexed auctionId, string artifactName, address indexed seller, uint256 startTime, uint256 endTime, uint256 minimumBid)",
  "event ConfidentialBidPlaced(uint32 indexed auctionId, address indexed bidder)",
  "event AuctionEnded(uint32 indexed auctionId, address indexed winner, uint256 winningBid, string artifactName)",
  "event ArtifactAuthenticated(uint32 indexed auctionId, address authenticator)",
  "event EarningsWithdrawn(address indexed seller, uint256 amount)"
];

function AuctionApp() {
  const client = useFhevmClient();
  const { encrypt, isEncrypting } = useEncrypt();

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const [contractStatus, setContractStatus] = useState<string>('Not deployed');

  const [activeTab, setActiveTab] = useState<string>('auctions');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    artifactName: '',
    artifactDescription: '',
    artifactCategory: '',
    yearCreated: '',
    provenance: '',
    minimumBid: '',
    auctionDuration: '24',
    authAuctionId: '',
    endAuctionId: '',
    resultAuctionId: ''
  });

  const [auctionResults, setAuctionResults] = useState<AuctionResults | null>(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        showError('Please install MetaMask to use this application');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const signerInstance = await browserProvider.getSigner();
      setSigner(signerInstance);

      const address = await signerInstance.getAddress();
      const networkInfo = await browserProvider.getNetwork();

      setAccount(address);
      setNetwork(networkInfo.name || `Chain ID: ${networkInfo.chainId}`);

      await loadContract(browserProvider, signerInstance);

      showSuccess('Wallet connected successfully');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      showError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
    }
  };

  const loadContract = async (providerInstance: ethers.BrowserProvider, signerInstance: ethers.Signer) => {
    if (!CONTRACT_ADDRESS) {
      setContractStatus('Not deployed');
      return;
    }

    try {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerInstance);
      setContract(contractInstance);

      try {
        const currentId = await contractInstance.currentAuctionId();
        setContractStatus(`Connected (${currentId.toString()} auctions)`);
      } catch (e: any) {
        setContractStatus(`Address: ${CONTRACT_ADDRESS.substring(0, 10)}...`);
      }
    } catch (error) {
      console.error('Error loading contract:', error);
      setContractStatus('Error loading contract');
    }
  };

  const createAuction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!contract || !signer) {
        showError('Please connect wallet first');
        return;
      }

      const minimumBidWei = ethers.parseEther(formData.minimumBid);
      const durationSeconds = parseInt(formData.auctionDuration) * 3600;

      showInfo('Creating auction...');

      const tx = await contract.createAuction(
        formData.artifactName,
        formData.artifactDescription,
        formData.artifactCategory,
        minimumBidWei,
        durationSeconds,
        parseInt(formData.yearCreated),
        formData.provenance
      );

      await tx.wait();

      showSuccess('Auction created successfully!');
      setFormData({
        ...formData,
        artifactName: '',
        artifactDescription: '',
        artifactCategory: '',
        yearCreated: '',
        provenance: '',
        minimumBid: '',
        auctionDuration: '24'
      });
      loadAuctions();
    } catch (error: any) {
      console.error('Error creating auction:', error);
      showError('Failed to create auction: ' + error.message);
    }
  };

  const authenticateArtifact = async () => {
    try {
      if (!contract) {
        showError('Please connect wallet first');
        return;
      }

      const auctionId = parseInt(formData.authAuctionId);
      if (!auctionId) {
        showError('Please enter a valid auction ID');
        return;
      }

      try {
        await contract.getAuctionInfo(auctionId);
      } catch (e) {
        showError(`Auction ID ${auctionId} does not exist. Please create an auction first.`);
        return;
      }

      showInfo('Authenticating artifact...');

      const tx = await contract.authenticateArtifact(auctionId);
      await tx.wait();

      showSuccess('Artifact authenticated successfully!');
      loadAuctions();
    } catch (error: any) {
      console.error('Error authenticating artifact:', error);
      showError('Failed to authenticate artifact: ' + error.message);
    }
  };

  const placeBid = async (auctionId: number) => {
    try {
      if (!contract || !client || !account) {
        showError('Please connect wallet and wait for FHEVM client to initialize');
        return;
      }

      const bidAmount = prompt('Enter your bid amount (ETH):');
      if (!bidAmount) return;

      const bidValue = parseFloat(bidAmount);
      if (bidValue <= 0) {
        showError('Bid amount must be greater than 0');
        return;
      }

      showInfo('Encrypting bid...');

      // Convert to wei and encrypt using FHEVM SDK
      const bidInWei = ethers.parseEther(bidAmount);

      const encryptedBid = await encrypt(
        CONTRACT_ADDRESS,
        account,
        (input) => input.add64(BigInt(bidInWei.toString()))
      );

      showInfo('Placing encrypted bid...');

      const tx = await contract.placeBid(auctionId, encryptedBid);
      await tx.wait();

      showSuccess('Bid placed successfully!');
      loadAuctions();
    } catch (error: any) {
      console.error('Error placing bid:', error);
      showError('Failed to place bid: ' + error.message);
    }
  };

  const endAuction = async () => {
    try {
      if (!contract) {
        showError('Please connect wallet first');
        return;
      }

      const auctionId = parseInt(formData.endAuctionId);
      if (!auctionId) {
        showError('Please enter a valid auction ID');
        return;
      }

      showInfo('Ending auction...');

      const tx = await contract.endAuction(auctionId);
      await tx.wait();

      showSuccess('Auction ended successfully!');
      loadAuctions();
    } catch (error: any) {
      console.error('Error ending auction:', error);
      showError('Failed to end auction: ' + error.message);
    }
  };

  const withdrawEarnings = async () => {
    try {
      if (!contract) {
        showError('Please connect wallet first');
        return;
      }

      showInfo('Withdrawing earnings...');

      const tx = await contract.withdrawEarnings();
      await tx.wait();

      showSuccess('Earnings withdrawn successfully!');
    } catch (error: any) {
      console.error('Error withdrawing earnings:', error);
      showError('Failed to withdraw earnings: ' + error.message);
    }
  };

  const getAuctionResults = async () => {
    try {
      if (!contract) {
        showError('Please connect wallet first');
        return;
      }

      const auctionId = parseInt(formData.resultAuctionId);
      if (!auctionId) {
        showError('Please enter a valid auction ID');
        return;
      }

      const results = await contract.getAuctionResults(auctionId);

      setAuctionResults({
        ended: results[0],
        winner: results[1],
        winningBid: results[2],
        totalBids: results[3]
      });
    } catch (error: any) {
      console.error('Error getting auction results:', error);
      showError('Failed to get auction results: ' + error.message);
    }
  };

  const loadAuctions = async () => {
    try {
      if (!contract) {
        setAuctions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const currentAuctionId = await contract.currentAuctionId();
      const auctionsList = [];

      for (let i = 1; i <= currentAuctionId; i++) {
        try {
          const auctionInfo = await contract.getAuctionInfo(i);
          const artifactDetails = await contract.getArtifactDetails(i);

          const endTime = new Date(Number(auctionInfo.endTime) * 1000);
          const now = new Date();
          const isActive = auctionInfo.isActive && now <= endTime;

          auctionsList.push({
            id: i,
            name: auctionInfo.name,
            description: auctionInfo.description,
            category: auctionInfo.category,
            minimumBid: auctionInfo.minimumBid,
            totalBids: auctionInfo.totalBids,
            endTime: endTime,
            isActive: isActive,
            authenticated: auctionInfo.authenticated,
            yearCreated: artifactDetails.yearCreated
          });
        } catch (error) {
          console.error(`Error loading auction ${i}:`, error);
        }
      }

      setAuctions(auctionsList);
      setLoading(false);
    } catch (error) {
      console.error('Error loading auctions:', error);
      setAuctions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && activeTab === 'auctions') {
      loadAuctions();
    }
  }, [contract, activeTab]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const showInfo = (message: string) => {
    showSuccess(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🏛️ Confidential Artifact Auction</h1>
        <p>Secure bidding for authentic artifacts using encrypted transactions</p>
      </div>

      <div className="connection-status">
        <p><strong>Wallet:</strong> <span>{account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not connected'}</span></p>
        <p><strong>Network:</strong> <span>{network || 'Unknown'}</span></p>
        <p><strong>Contract:</strong> <span>{contractStatus}</span></p>
        {!account && (
          <button className="btn" onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>

      {errorMessage && (
        <div className="error">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="success">{successMessage}</div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'auctions' ? 'active' : ''}`}
          onClick={() => setActiveTab('auctions')}
        >
          Active Auctions
        </button>
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Auction
        </button>
        <button
          className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>

      {activeTab === 'auctions' && (
        <div className="tab-content active">
          <div className="card">
            <h3>Active Auctions</h3>
            <div className="auction-grid">
              {loading ? (
                <div className="loading">Loading auctions...</div>
              ) : auctions.length === 0 ? (
                <div className="loading">
                  {contract ? 'No auctions found' : 'Please connect wallet first'}
                </div>
              ) : (
                auctions.map((auction) => (
                  <div key={auction.id} className="auction-item">
                    <h4>{auction.name}</h4>
                    <p><strong>Category:</strong> {auction.category}</p>
                    <p><strong>Description:</strong> {auction.description}</p>
                    <p><strong>Year Created:</strong> {auction.yearCreated.toString()}</p>
                    <p><strong>Minimum Bid:</strong> {ethers.formatEther(auction.minimumBid)} ETH</p>
                    <p><strong>Total Bids:</strong> {auction.totalBids.toString()}</p>
                    <p><strong>End Time:</strong> {auction.endTime.toLocaleString()}</p>
                    <p>
                      <strong>Status:</strong>
                      <span className={`auction-status ${auction.isActive ? 'status-active' : 'status-ended'}`}>
                        {auction.isActive ? 'Active' : 'Ended'}
                      </span>
                      {auction.authenticated ? (
                        <span className="auction-status status-authenticated">Authenticated</span>
                      ) : (
                        <span className="auction-status">Not Authenticated</span>
                      )}
                    </p>
                    {auction.isActive && auction.authenticated && (
                      <button
                        className="btn"
                        onClick={() => placeBid(auction.id)}
                        disabled={isEncrypting}
                      >
                        {isEncrypting ? 'Encrypting...' : 'Place Bid'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="tab-content active">
          <div className="card">
            <h3>Create New Auction</h3>
            <form onSubmit={createAuction}>
              <div className="form-group">
                <label htmlFor="artifactName">Artifact Name</label>
                <input
                  type="text"
                  name="artifactName"
                  value={formData.artifactName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="artifactDescription">Description</label>
                <textarea
                  name="artifactDescription"
                  rows={3}
                  value={formData.artifactDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="artifactCategory">Category</label>
                <select
                  name="artifactCategory"
                  value={formData.artifactCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="painting">Painting</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="ceramic">Ceramic</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="manuscript">Manuscript</option>
                  <option value="textile">Textile</option>
                  <option value="furniture">Furniture</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="yearCreated">Year Created</label>
                <input
                  type="number"
                  name="yearCreated"
                  min="0"
                  max="2024"
                  value={formData.yearCreated}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="provenance">Provenance</label>
                <textarea
                  name="provenance"
                  rows={2}
                  placeholder="History and ownership details"
                  value={formData.provenance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="minimumBid">Minimum Bid (ETH)</label>
                <input
                  type="number"
                  name="minimumBid"
                  step="0.001"
                  min="0.001"
                  value={formData.minimumBid}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="auctionDuration">Auction Duration (hours)</label>
                <input
                  type="number"
                  name="auctionDuration"
                  min="1"
                  max="168"
                  value={formData.auctionDuration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn">Create Auction</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="tab-content active">
          <div className="card">
            <h3>Authenticator Functions</h3>
            <div className="form-group">
              <label htmlFor="authAuctionId">Auction ID to Authenticate</label>
              <input
                type="number"
                name="authAuctionId"
                min="1"
                value={formData.authAuctionId}
                onChange={handleInputChange}
              />
            </div>
            <button className="btn" onClick={authenticateArtifact}>Authenticate Artifact</button>
          </div>

          <div className="card">
            <h3>End Auction</h3>
            <div className="form-group">
              <label htmlFor="endAuctionId">Auction ID to End</label>
              <input
                type="number"
                name="endAuctionId"
                min="1"
                value={formData.endAuctionId}
                onChange={handleInputChange}
              />
            </div>
            <button className="btn" onClick={endAuction}>End Auction</button>
          </div>

          <div className="card">
            <h3>Withdraw Earnings</h3>
            <p>Withdraw your earnings from completed auctions.</p>
            <button className="btn" onClick={withdrawEarnings}>Withdraw Earnings</button>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="tab-content active">
          <div className="card">
            <h3>Auction Results</h3>
            <div className="form-group">
              <label htmlFor="resultAuctionId">Auction ID</label>
              <input
                type="number"
                name="resultAuctionId"
                min="1"
                value={formData.resultAuctionId}
                onChange={handleInputChange}
              />
            </div>
            <button className="btn" onClick={getAuctionResults}>Get Results</button>
            {auctionResults && (
              <div style={{ marginTop: '20px' }}>
                <div className="card">
                  <h4>Auction {formData.resultAuctionId} Results</h4>
                  <p><strong>Ended:</strong> {auctionResults.ended ? 'Yes' : 'No'}</p>
                  <p><strong>Winner:</strong> {auctionResults.winner}</p>
                  <p><strong>Winning Bid:</strong> {ethers.formatEther(auctionResults.winningBid)} ETH</p>
                  <p><strong>Total Bids:</strong> {auctionResults.totalBids.toString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  if (!provider) {
    return (
      <div className="container">
        <div className="header">
          <h1>🏛️ Confidential Artifact Auction</h1>
          <p>Please install MetaMask to use this application</p>
        </div>
      </div>
    );
  }

  return (
    <FhevmProvider provider={provider}>
      <AuctionApp />
    </FhevmProvider>
  );
}
