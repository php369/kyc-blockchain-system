import Spline from '@splinetool/react-spline/next';
import Navbar from '../components/Navbar.js'; // Import the Navbar

export default function Home() {
  return (
    <main style={{ height: "100vh", width: "100vw", overflowX: "hidden" }}>
      {/* Navbar */}
      <Navbar />

      <Spline
        scene="https://prod.spline.design/xb5fd9wZ5bONCsIW/scene.splinecode" 
      />

      <section id="features" style={{ padding: '4rem 2rem', backgroundColor: '#111' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Key Features</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <FeatureBlock
            title="Secure Verification"
            description="End-to-end encrypted document verification with multi-layer security."
          />
          <FeatureBlock
            title="Blockchain Technology"
            description="Immutable record-keeping using Ethereum blockchain technology."
          />
          <FeatureBlock
            title="Decentralized Storage"
            description="Documents stored on IPFS for secure and distributed access."
          />
          <FeatureBlock
            title="Transparent Auditing"
            description="Complete audit trail of all verification activities."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howitworks" style={{ padding: '4rem 2rem', backgroundColor: '#000' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          maxWidth: '1000px',
          margin: '0 auto',
          gap: '2rem'
        }}>
          <StepBlock number={1} title="Register to Connect Wallet" description="Connect your Ethereum wallet to create a secure blockchain identity." />
          <StepBlock number={2} title="Submit Documents" description="Upload your Aadhaar card and other required documents for verification." />
          <StepBlock number={3} title="Get Verified" description="Bank employees verify your documents and update your KYC status on the blockchain." />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ width: "100%", padding: "1rem", background: "#111", textAlign: "center" }}>
        <p>© 2025 KYC Blockchain System</p>
      </footer>
    </main>
  );
}
// Feature Block
function FeatureBlock({ title, description }) {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      padding: '1.5rem',
      flex: '1 1 250px',
      textAlign: 'center',
      boxShadow: '0 0 10px rgba(255,255,255,0.05)'
    }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#ccc', fontSize: '0.95rem' }}>{description}</p>
    </div>
  );
}

// Step Block with Number
function StepBlock({ number, title, description }) {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      padding: '1.5rem',
      flex: '1 1 280px',
      textAlign: 'center',
      boxShadow: '0 0 10px rgba(255,255,255,0.05)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#00e676',
        color: '#000',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem auto',
        fontSize: '1.2rem'
      }}>{number}</div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#ccc', fontSize: '0.95rem' }}>{description}</p>
    </div>
  );
}