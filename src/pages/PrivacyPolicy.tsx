import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO 
        title="Privacy Policy | NCERT PDF Combiner" 
        description="Read our privacy policy to understand how we protect your data. 100% client-side processing means zero uploads to our servers."
      />
      <div className="container glass-panel">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Privacy Policy</h1>
        <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Introduction</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Welcome to the NCERT PDF Combiner. Your privacy is of paramount importance to us. This Privacy Policy outlines our data processing practices.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. 100% Local Processing (Zero Data Collection)</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Our application is built on a strict "Client-Side First" architecture. When you upload a ZIP file or multiple PDFs, the files are processed <strong>entirely within your web browser</strong>. We do not upload, transmit, or store any of your files on any external servers. Your documents never leave your device.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. External Links & CORS Proxies</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          If you use our "Fetch ZIP via URL" feature, your browser will make a request to the provided URL. If the URL requires a CORS bypass to be readable by your browser, we route the request through a public, anonymous CORS proxy (like `corsproxy.io`) solely to stream the file to your local session. We do not control these third-party proxies.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Analytics and Tracking</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Currently, we do not use cookies or tracking pixels to monitor your behavior. This is a static application hosted on Firebase.
        </p>
      </div>
    </>
  );
}
