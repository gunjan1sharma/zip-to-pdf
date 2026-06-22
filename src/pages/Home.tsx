import { useState, useRef } from 'react';
import { UploadCloud, FileDown, Settings, AlertCircle, CheckCircle2, Loader2, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractPdfsFromZip, mergePdfs } from '../lib/pdfWorker';
import type { PdfFile } from '../lib/pdfWorker';
import { SortableFileList } from '../components/SortableFileList';

import SEO from '../components/SEO';

function Home() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [outputName, setOutputName] = useState('Merged_NCERT_Book');
  const [includeTocPage, setIncludeTocPage] = useState(true);
  const [includeBookmarks, setIncludeBookmarks] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);


  const processFiles = async (fileList: File[]) => {
    try {
      setError(null);
      setIsExtracting(true);
      
      let allExtracted: PdfFile[] = [...files]; // Keep existing files if any

      for (const file of fileList) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          const extracted = await extractPdfsFromZip(file);
          allExtracted = [...allExtracted, ...extracted];
        } else if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
          const buffer = await file.arrayBuffer();
          allExtracted.push({
            id: file.name + '-' + Date.now() + Math.random(),
            name: file.name,
            data: new Uint8Array(buffer)
          });
        }
      }

      // Default Natural Sorting for newly added files if needed, or sort all together
      allExtracted.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      // Limit to 30 files
      if (allExtracted.length > 30) {
        setError("Warning: A maximum of 30 PDF files is allowed. Truncating the list.");
        allExtracted = allExtracted.slice(0, 30);
      } else if (allExtracted.length === 0) {
        setError("No PDF files found.");
      }

      setFiles(allExtracted);
    } catch (err: any) {
      setError("Failed to process files: " + err.message);
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processFile = async (file: File | Blob) => {
    // Keep backward compatibility for the URL fetcher which passes a single Blob
    if (file instanceof File) {
      await processFiles([file]);
    } else {
      // It's a blob from the URL fetcher
      // Convert Blob to File with a dummy name
      const tempFile = new File([file], "downloaded.zip", { type: 'application/zip' });
      await processFiles([tempFile]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    
    await processFiles(selectedFiles);
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    
    try {
      setError(null);
      setIsFetchingUrl(true);
      
      // Basic validation
      let urlObj;
      try {
        urlObj = new URL(urlInput.trim());
      } catch (e) {
        throw new Error("Invalid URL format.");
      }

      if (!urlObj.pathname.toLowerCase().endsWith('.zip')) {
        throw new Error("The URL does not appear to point to a .zip file.");
      }

      // Try fetching directly, fallback to proxy to avoid CORS issues
      let response;
      try {
        response = await fetch(urlObj.toString());
      } catch (e) {
        // Fallback to CORS proxy
        response = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(urlObj.toString())}`);
      }

      if (!response.ok) {
        throw new Error(`Failed to download file (HTTP ${response.status}). The link might be broken or inaccessible.`);
      }

      const blob = await response.blob();
      
      if (blob.type !== 'application/zip' && blob.type !== 'application/x-zip-compressed' && !blob.type.includes('zip')) {
        console.warn("MIME type isn't standard ZIP, but attempting extraction anyway...", blob.type);
      }

      // Process it as a File
      await processFile(blob);
      setUrlInput('');
    } catch (err: any) {
      setError("Failed to fetch URL: " + err.message);
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    
    try {
      setError(null);
      setIsMerging(true);
      setProgressMsg("Starting merge...");
      
      const mergedBytes = await mergePdfs(files, {
        includeTocPage,
        includeBookmarks,
        outputName: outputName || 'Merged_NCERT_Book'
      }, setProgressMsg);
      
      setProgressMsg("Downloading...");
      
      // Trigger download
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const finalName = outputName.endsWith('.pdf') ? outputName : `${outputName}.pdf`;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setProgressMsg("Complete!");
      setTimeout(() => setProgressMsg(''), 3000);
    } catch (err: any) {
      setError("Failed to merge PDFs: " + err.message);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <>
      <SEO 
        title="NCERT PDF Combiner | Merge Multiple PDFs Securely"
        description="The fastest, most secure multiple PDF combiner. Convert ZIP to PDF directly in your browser. No compression, perfect quality, local processing."
        keywords="ncert combiner, zip to pdf, multiple pdf combiner, merge pdf locally, high quality pdf merge"
      />
      <div className="container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <FileDown color="var(--primary)" size={36} />
            Zip to PDF Merger
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Seamlessly merge NCERT chapters directly in your browser. 100% Private.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid var(--danger)',
              padding: '1rem',
              borderRadius: '0.5rem',
              color: '#fca5a5',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {files.length === 0 ? (
          <div>
            <div 
              className="dropzone"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginBottom: '1.5rem' }}
            >
              <input 
                type="file" 
                multiple
                accept=".zip,application/zip,application/x-zip-compressed,.pdf,application/pdf" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              {isExtracting ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Loader2 size={48} color="var(--primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <p>Extracting PDFs from Zip...</p>
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <UploadCloud size={48} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Click or drag ZIP or PDF files here</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>You can select up to 30 PDF files or a single ZIP.</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>OR</span>
              <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Paste ZIP URL (e.g. https://ncert.nic.in/.../kegy2dd.zip)" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
                style={{ flex: 1 }}
              />
              <button 
                className="btn" 
                onClick={handleFetchUrl}
                disabled={isFetchingUrl}
                style={{ whiteSpace: 'nowrap' }}
              >
                {isFetchingUrl ? (
                  <><Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} /> Fetching...</>
                ) : (
                  <><Link size={20} /> Fetch URL</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Extracted Chapters ({files.length})</h3>
              <button 
                onClick={() => setFiles([])}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Start Over
              </button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Files have been naturally sorted. Drag and drop to reorder if needed (e.g., move Preface/Glossary).
            </p>

            <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '2rem', paddingRight: '0.5rem' }}>
              <SortableFileList files={files} onReorder={setFiles} />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--surface)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Settings size={20} /> Configuration
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    className="checkbox-input" 
                    checked={includeTocPage} 
                    onChange={(e) => setIncludeTocPage(e.target.checked)} 
                  />
                  <span>Include Visual Table of Contents Page (at beginning)</span>
                </label>
                
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    className="checkbox-input" 
                    checked={includeBookmarks} 
                    onChange={(e) => setIncludeBookmarks(e.target.checked)} 
                  />
                  <span>Include Native PDF Sidebar Bookmarks (Outline)</span>
                </label>
                
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Output Filename
                  </label>
                  <input 
                    type="text" 
                    value={outputName} 
                    onChange={(e) => setOutputName(e.target.value)}
                    placeholder="Merged_NCERT_Book"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="btn" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                onClick={handleMerge}
                disabled={isMerging}
              >
                {isMerging ? (
                  <>
                    <Loader2 className="animate-spin" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    {progressMsg}
                  </>
                ) : (
                  <>
                    <FileDown size={24} />
                    Merge and Download PDF
                  </>
                )}
              </button>
              <AnimatePresence>
                {progressMsg === "Complete!" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <CheckCircle2 size={20} />
                    Successfully merged and downloaded!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
    </>
  );
}

export default Home;
