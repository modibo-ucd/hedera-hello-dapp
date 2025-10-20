// src/App.jsx
import { createSignal, onMount } from 'solid-js';
import { ethers } from 'ethers';
import { JsonABI } from './abi';

function App() {
  // ============================================
  // SIGNALS (État réactif SolidJS)
  // ============================================
  const [currentMessage, setCurrentMessage] = createSignal('Chargement...');
  const [newMessage, setNewMessage] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [txHash, setTxHash] = createSignal('');
  const [connected, setConnected] = createSignal(false);

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
  const RPC_URL = import.meta.env.VITE_TESTNET_ENDPOINT;
  const PRIVATE_KEY = import.meta.env.VITE_HEX_PRIVATE_KEY;

  let provider;
  let signer;
  let contract;

  // ============================================
  // INITIALISATION (au chargement)
  // ============================================
  onMount(async () => {
    try {
      await initializeContract();
      await loadMessage();
    } catch (err) {
      setError(`Erreur d'initialisation : ${err.message}`);
      console.error(err);
    }
  });

  // ============================================
  // FONCTION : Initialiser le contrat
  // ============================================
  const initializeContract = async () => {
    if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
      throw new Error("Variables d'environnement manquantes dans .env");
    }

    // Connexion au provider Hedera Testnet
    provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Créer un wallet avec la clé privée
    signer = new ethers.Wallet(PRIVATE_KEY, provider);

    // Instancier le contrat
    contract = new ethers.Contract(CONTRACT_ADDRESS, JsonABI, signer);

    setConnected(true);
    console.log('Contrat initialisé avec succès');
  };

  // ============================================
  // FONCTION : Lire le message actuel
  // ============================================
  const loadMessage = async () => {
    try {
      setLoading(true);
      setError('');

      const message = await contract.getMessage();
      setCurrentMessage(message);

      console.log('Message actuel :', message);
    } catch (err) {
      setError(`Erreur de lecture : ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FONCTION : Mettre à jour le message
  // ============================================
  const updateMessage = async () => {
    const messageToSend = newMessage().trim();

    if (!messageToSend) {
      setError('Le message ne peut pas être vide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTxHash('');

      console.log('Envoi de la transaction...');

      // Appeler la fonction setMessage du contrat
      const tx = await contract.setMessage(messageToSend);

      console.log('Transaction envoyée, hash :', tx.hash);
      setTxHash(tx.hash);

      // Attendre la confirmation
      const receipt = await tx.wait();

      console.log('Transaction confirmée :', receipt);

      // Recharger le message
      await loadMessage();

      // Réinitialiser le champ
      setNewMessage('');
    } catch (err) {
      setError(`Erreur de mise à jour : ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDU DE L'INTERFACE
  // ============================================
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* En-tête */}
        <h1 style={styles.title}>🌐 HelloHedera Dapp</h1>
        <p style={styles.subtitle}>
          Interagir avec un Smart Contract sur Hedera Testnet
        </p>

        {/* Statut de connexion */}
        <div style={styles.statusBadge(connected())}>
          {connected() ? '🟢 Connecté' : '🔴 Déconnecté'}
        </div>

        {/* Affichage des erreurs */}
        {error() && <div style={styles.errorBox}>⚠️ {error()}</div>}

        {/* Section : Message actuel */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Message Actuel</h2>
          <div style={styles.messageBox}>
            {loading() && !currentMessage() ? (
              <span style={styles.loader}>Chargement...</span>
            ) : (
              <p style={styles.message}>{currentMessage()}</p>
            )}
          </div>
          <button
            onClick={loadMessage}
            disabled={loading()}
            style={styles.button}
          >
            Rafraîchir
          </button>
        </div>

        {/* Section : Mettre à jour le message */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Mettre à Jour le Message</h2>
          <input
            type="text"
            placeholder="Entrez un nouveau message..."
            value={newMessage()}
            onInput={(e) => setNewMessage(e.target.value)}
            disabled={loading()}
            style={styles.input}
          />
          <button
            onClick={updateMessage}
            disabled={loading() || !newMessage().trim()}
            style={styles.button}
          >
            {loading() ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>

        {/* Hash de transaction */}
        {txHash() && (
          <div style={styles.txBox}>
            <strong>Transaction Hash :</strong>
            <br />
            <a
              href={`https://hashscan.io/testnet/transaction/${txHash()}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {txHash()}
            </a>
          </div>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <p>
            Contrat : <code>{CONTRACT_ADDRESS}</code>
          </p>
          <p>Réseau : Hedera Testnet</p>
        </footer>
      </div>
    </div>
  );
}

// ============================================
// STYLES (CSS-in-JS)
// ============================================
const styles = {
  container: {
    'min-height': '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    padding: '20px',
    'font-family':
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: 'white',
    'border-radius': '20px',
    'box-shadow': '0 20px 60px rgba(0,0,0,0.3)',
    padding: '40px',
    'max-width': '600px',
    width: '100%',
  },
  title: {
    'font-size': '2.5rem',
    color: '#333',
    margin: '0 0 10px 0',
    'text-align': 'center',
  },
  subtitle: {
    color: '#666',
    'text-align': 'center',
    'margin-bottom': '30px',
  },
  statusBadge: (isConnected) => ({
    background: isConnected ? '#10b981' : '#ef4444',
    color: 'white',
    padding: '8px 16px',
    'border-radius': '20px',
    display: 'inline-block',
    'font-weight': 'bold',
    'margin-bottom': '20px',
  }),
  section: {
    'margin-bottom': '30px',
  },
  sectionTitle: {
    'font-size': '1.3rem',
    color: '#444',
    'margin-bottom': '15px',
  },
  messageBox: {
    background: '#f3f4f6',
    padding: '20px',
    'border-radius': '10px',
    'margin-bottom': '15px',
    'min-height': '60px',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
  },
  message: {
    'font-size': '1.1rem',
    color: '#333',
    margin: '0',
    'text-align': 'center',
  },
  loader: {
    color: '#667eea',
    'font-weight': 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    'font-size': '1rem',
    border: '2px solid #e5e7eb',
    'border-radius': '8px',
    'margin-bottom': '15px',
    'box-sizing': 'border-box',
    transition: 'border-color 0.3s',
    ':focus': {
      'border-color': '#667eea',
      outline: 'none',
    },
  },
  button: {
    width: '100%',
    padding: '12px 24px',
    'font-size': '1rem',
    'font-weight': 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    'border-radius': '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.3s',
    ':hover': {
      transform: 'translateY(-2px)',
    },
    ':disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
  errorBox: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    'border-radius': '8px',
    'margin-bottom': '20px',
    'border-left': '4px solid #ef4444',
  },
  txBox: {
    background: '#dbeafe',
    padding: '15px',
    'border-radius': '8px',
    'margin-top': '20px',
    'word-break': 'break-all',
  },
  link: {
    color: '#2563eb',
    'text-decoration': 'none',
    ':hover': {
      'text-decoration': 'underline',
    },
  },
  footer: {
    'margin-top': '40px',
    'padding-top': '20px',
    'border-top': '1px solid #e5e7eb',
    'text-align': 'center',
    color: '#6b7280',
    'font-size': '0.9rem',
  },
};

export default App;
