import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import BlogList from './pages/BlogList';
import Blog1 from './pages/blogs/Blog1';
import Blog2 from './pages/blogs/Blog2';
import Blog3 from './pages/blogs/Blog3';
import Blog4 from './pages/blogs/Blog4';
import Blog5 from './pages/blogs/Blog5';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>
          NCERT PDF Combiner
        </Link>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
          <Link to="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Blog</Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/ncert-combiner-how-to" element={<Blog1 />} />
          <Route path="/blog/zip-to-pdf-converter" element={<Blog2 />} />
          <Route path="/blog/multiple-pdf-combiner" element={<Blog3 />} />
          <Route path="/blog/high-quality-pdf-merge" element={<Blog4 />} />
          <Route path="/blog/secure-local-pdf-merge" element={<Blog5 />} />
        </Routes>
      </main>

      <footer style={{ padding: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <Link to="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms & Conditions</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} NCERT PDF Combiner. All rights reserved.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>100% Client-Side. We never upload your files.</p>
      </footer>
    </div>
  );
}
