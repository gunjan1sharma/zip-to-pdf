import SEO from '../components/SEO';

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms & Conditions | NCERT PDF Combiner" 
        description="Terms and conditions for using the NCERT PDF Combiner application."
      />
      <div className="container glass-panel">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Terms & Conditions</h1>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of the Service</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          This tool is provided "as is" for the convenience of merging educational PDFs. You are responsible for ensuring that you have the right to process the documents you upload. The tool operates locally on your machine.
        </p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. Disclaimer of Warranties</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          The application is provided without any warranties, express or implied. We do not warrant that the application will be error-free or uninterrupted.
        </p>
      </div>
    </>
  );
}
