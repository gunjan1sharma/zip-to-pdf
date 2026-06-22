# NCERT ZIP to PDF Combiner

![NCERT ZIP to PDF Combiner](https://ncert-zip-to-pdf.web.app/favicon.ico)

A lightning-fast, 100% client-side React application that securely converts ZIP archives of NCERT chapters (or individual PDF files) into a single, high-quality merged PDF book.

**Live Demo:** [https://ncert-zip-to-pdf.web.app](https://ncert-zip-to-pdf.web.app)

## Features

- 🔒 **100% Secure & Private**: All extraction and merging happen locally in your web browser. No files are ever uploaded to a server.
- ⚡ **Zero Server Dependency**: Utilizing WebAssembly and Web APIs to process heavy PDFs instantly.
- 📂 **Direct ZIP Parsing**: Upload the `.zip` file exactly as you downloaded it from the NCERT portal. The app extracts it in memory.
- 🔗 **URL Fetching**: Paste a direct link to a `.zip` file, and the app will fetch and bypass CORS securely to download it straight into your session.
- 📑 **Visual Table of Contents**: Automatically generates a clickable, beautifully styled Table of Contents page.
- 🔖 **Native PDF Bookmarks**: Injects standard PDF metadata so your ebook reader can display a collapsible sidebar for easy navigation.
- 🖱️ **Drag & Drop Reordering**: Easily rearrange chapters, glossaries, or prefaces using a smooth, animated drag-and-drop interface before merging.
- 🚀 **SEO Optimized**: Fully equipped with React Helmet Async for hyper-SEO, complete with organically ranked blog posts.

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **PDF Manipulation**: `pdf-lib` for lossless byte-level merging.
- **Archive Handling**: `jszip` for client-side ZIP extraction.
- **Drag & Drop**: `@dnd-kit` for accessible and performant sorting.
- **Styling**: Vanilla CSS with modern Glassmorphism aesthetics.
- **Routing & SEO**: `react-router-dom` and `react-helmet-async`.
- **Hosting**: Firebase Hosting.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gunjan1sharma/zip-to-pdf.git
   cd zip-to-pdf
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Why This Tool Exists
Downloading textbooks from official portals often results in messy archives filled with individual chapter files (e.g., `kegy201.pdf`, `kegy202.pdf`). Generic cloud mergers usually compress these documents, destroying text quality and violating privacy. This tool solves both issues by leveraging the sheer power of modern client-side processing to stitch vectors together flawlessly.

## License
MIT License. Free to use and modify.
