import JSZip from 'jszip';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfLib from 'pdf-lib';
import { outlinePdfFactory } from '@lillallol/outline-pdf';

const outlinePdf = outlinePdfFactory(pdfLib);

export interface PdfFile {
  id: string; // The file path inside the zip
  name: string; // The base name
  data: Uint8Array; // The raw bytes
}

export interface MergeOptions {
  includeTocPage: boolean;
  includeBookmarks: boolean;
  outputName: string;
}

export const extractPdfsFromZip = async (zipFile: File): Promise<PdfFile[]> => {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);
  
  const pdfFiles: PdfFile[] = [];
  
  const promises: Promise<void>[] = [];
  
  loadedZip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir && relativePath.toLowerCase().endsWith('.pdf')) {
      const promise = zipEntry.async('uint8array').then((data) => {
        pdfFiles.push({
          id: relativePath,
          name: relativePath.split('/').pop() || relativePath,
          data,
        });
      });
      promises.push(promise);
    }
  });
  
  await Promise.all(promises);
  
  // Default Natural Sorting
  pdfFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  
  return pdfFiles;
};

export const mergePdfs = async (
  files: PdfFile[], 
  options: MergeOptions, 
  onProgress?: (msg: string) => void
): Promise<Uint8Array> => {
  onProgress?.("Initializing document...");
  let mergedPdf = await PDFDocument.create();
  const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
  
  // Track outlines for bookmarks or TOC
  const outlineItems: { title: string; pageIndex: number }[] = [];
  let currentPageOffset = 0;
  
  // We will load all PDFs first to know how many pages they have
  onProgress?.("Loading individual chapters...");
  const loadedDocs: { doc: PDFDocument; file: PdfFile; numPages: number }[] = [];
  for (const file of files) {
    const doc = await PDFDocument.load(file.data);
    loadedDocs.push({ doc, file, numPages: doc.getPageCount() });
  }

  // If we need a TOC page, we must reserve a page for it (or multiple pages if very long, but we'll assume 1 page for now as most books have < 30 chapters)
  let tocPageIndex = -1;
  if (options.includeTocPage) {
    const tocPage = mergedPdf.addPage();
    tocPageIndex = 0;
    currentPageOffset += 1;
    
    // Draw TOC header
    tocPage.drawText("Table of Contents", {
      x: 50,
      y: tocPage.getHeight() - 50,
      size: 24,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  }

  // Now append pages
  for (let i = 0; i < loadedDocs.length; i++) {
    const { doc, file, numPages } = loadedDocs[i];
    onProgress?.(`Merging ${file.name}...`);
    
    // Record for outlines/TOC
    // Let's make a readable title from the filename (e.g., "kegy201.pdf" -> "kegy201")
    const title = file.name.replace(/\.pdf$/i, '');
    outlineItems.push({
      title,
      pageIndex: currentPageOffset,
    });
    
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
    
    currentPageOffset += numPages;
  }

  // Fill in the TOC page content if needed
  if (options.includeTocPage && tocPageIndex !== -1) {
    onProgress?.("Generating Visual Table of Contents...");
    const tocPage = mergedPdf.getPage(tocPageIndex);
    const startY = tocPage.getHeight() - 100;
    const lineHeight = 20;
    
    for (let i = 0; i < outlineItems.length; i++) {
      const item = outlineItems[i];
      const y = startY - (i * lineHeight);
      
      // Draw text
      tocPage.drawText(`${item.title} ......................... Page ${item.pageIndex + 1}`, {
        x: 50,
        y,
        size: 14,
        font,
        color: rgb(0, 0, 0.8),
      });

      // We cannot easily do internal links in standard pdf-lib without complex dict manipulation.
      // But actually we can create an annotation.
      // It's a bit complex, let's use standard text for now or we can try native bookmarks which are more robust.
      // We will provide the text visually, and the sidebar bookmarks for navigation.
    }
  }
  
  // Generate Native Bookmarks using outline-pdf
  if (options.includeBookmarks && outlineItems.length > 0) {
    onProgress?.("Generating PDF Bookmarks...");
    // lillallol/outline-pdf format string
    // e.g., "1|Title|pageNumber"
    let outlineString = "";
    for (const item of outlineItems) {
      // For lillallol/outline-pdf, format is: pageNumber|depthIndicator|Title
      // We use empty string for depthIndicator since we just want a flat list.
      outlineString += `${item.pageIndex + 1}||${item.title}\n`;
    }
    
    try {
      // The outlinePdf function takes outline string and PDFDocument
      await outlinePdf({
        outline: outlineString,
        pdf: mergedPdf
      });
    } catch (err) {
      console.warn("Failed to generate outlines via outlinePdf:", err);
    }
  }

  onProgress?.("Finalizing document...");
  const finalBytes = await mergedPdf.save();
  return finalBytes;
};
