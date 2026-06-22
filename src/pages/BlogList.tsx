import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const blogs = [
  { path: '/blog/ncert-combiner-how-to', title: 'How to Combine NCERT Chapter PDFs into a Single Book' },
  { path: '/blog/zip-to-pdf-converter', title: 'The Fastest ZIP to PDF Converter That Runs in Your Browser' },
  { path: '/blog/multiple-pdf-combiner', title: 'Why You Need a Multiple PDF Combiner That Respects Privacy' },
  { path: '/blog/high-quality-pdf-merge', title: 'How to Merge PDFs Without Losing Quality or Compression' },
  { path: '/blog/secure-local-pdf-merge', title: 'Client-Side Document Processing: The Future of PDF Tools' },
];

export default function BlogList() {
  return (
    <>
      <SEO 
        title="Blog | NCERT PDF Combiner Guides & Articles" 
        description="Read our latest articles on merging PDFs, handling ZIP archives, and maintaining document privacy."
      />
      <div className="container glass-panel">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Blog & Guides</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Explore our articles to learn more about securely managing your educational documents.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {blogs.map((blog) => (
            <Link 
              key={blog.path} 
              to={blog.path} 
              style={{ 
                padding: '1.5rem', 
                backgroundColor: 'var(--surface)', 
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                transition: 'border-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{blog.title}</h2>
              <span style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 'bold' }}>Read Article &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
