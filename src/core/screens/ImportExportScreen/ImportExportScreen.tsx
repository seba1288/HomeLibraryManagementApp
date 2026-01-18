import styles from './ImportExportScreen.module.css';
import { useState, useRef } from 'react';
import { getBooks, createBook } from '../../services/books/books.service';

type ImportExportScreenProps = {
  onImportComplete: () => void;
};

function ImportExportScreen({ onImportComplete }: ImportExportScreenProps) {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);
    try {
      const books = await getBooks({ limit: 1000 });
      
      let content: string;
      let filename: string;
      let mimeType: string;

      if (exportFormat === 'json') {
        content = JSON.stringify(books, null, 2);
        filename = `library-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        const headers = ['id', 'title', 'authors', 'genres', 'year_of_publishing', 'isbn', 'pages', 'status', 'notes', 'cover_url'];
        const rows = books.map((book: any) => {
          const authors = (book.authors || []).map((a: any) => a.first_name || '').join(';');
          const genres = (book.genres || []).map((g: any) => g.name || '').join(';');
          return [
            book.id || '',
            escapeCSV(book.title || ''),
            escapeCSV(authors),
            escapeCSV(genres),
            book.year_of_publishing || '',
            escapeCSV(book.isbn || ''),
            book.pages || '',
            escapeCSV(book.status || ''),
            escapeCSV(book.notes || ''),
            escapeCSV(book.cover_url || '')
          ].join(',');
        });
        content = [headers.join(','), ...rows].join('\n');
        filename = `library-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: `Successfully exported ${books.length} books!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to export' });
    }
    setExporting(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const isJson = file.name.endsWith('.json') || file.type === 'application/json';
      
      let booksToImport: any[] = [];

      if (isJson) {
        const parsed = JSON.parse(text);
        booksToImport = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');
        
        const headers = parseCSVLine(lines[0]);
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const obj: any = {};
          headers.forEach((h, idx) => {
            obj[h.toLowerCase().trim()] = values[idx] || '';
          });
          booksToImport.push(obj);
        }
      }

      let imported = 0;
      let errors: string[] = [];

      for (const bookData of booksToImport) {
        try {
          const book = bookData.book || bookData;
          
          await createBook({
            title: book.title || 'Untitled',
            authors: parseAuthors(book.authors),
            genres: parseGenres(book.genres),
            year_of_publishing: book.year_of_publishing ? Number(book.year_of_publishing) : null,
            isbn: book.isbn || null,
            pages: book.pages ? Number(book.pages) : null,
            notes: book.notes || null,
            cover_url: book.cover_url || null,
          });
          imported++;
        } catch (err: any) {
          errors.push(`Row ${imported + errors.length + 1}: ${err.message}`);
        }
      }

      if (errors.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `Imported ${imported} books. ${errors.length} errors: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}` 
        });
      } else {
        setMessage({ type: 'success', text: `Successfully imported ${imported} books!` });
      }
      
      onImportComplete();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to import' });
    }

    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Import & Export</h1>
      
      <div className={styles.sections}>
        {/* Export Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Export Library</h2>
          </div>
          <p className={styles.description}>
            Export your entire library to a file. Use this to backup your data or transfer it to another device.
          </p>
          
          <div className={styles.formatSelector}>
            <label className={styles.formatOption}>
              <input 
                type="radio" 
                name="format" 
                value="json" 
                checked={exportFormat === 'json'}
                onChange={() => setExportFormat('json')}
              />
              <span className={styles.formatLabel}>
                <strong>JSON</strong>
                <small>Best for backups and re-importing</small>
              </span>
            </label>
            <label className={styles.formatOption}>
              <input 
                type="radio" 
                name="format" 
                value="csv" 
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
              />
              <span className={styles.formatLabel}>
                <strong>CSV</strong>
                <small>Compatible with Excel, Google Sheets</small>
              </span>
            </label>
          </div>

          <button 
            className={styles.actionButton} 
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
          </button>
        </div>

        {/* Import Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Import Books</h2>
          </div>
          <p className={styles.description}>
            Import books from a JSON or CSV file. The file should contain book data with fields like title, authors, genres, etc.
          </p>

          <div className={styles.importInfo}>
            <h4>Supported formats:</h4>
            <ul>
              <li><strong>JSON</strong> - Array of book objects</li>
              <li><strong>CSV</strong> - With headers: title, authors, genres, year_of_publishing, isbn, pages, status, notes</li>
            </ul>
            <p className={styles.note}>
              For CSV files, separate multiple authors or genres with semicolons (;)
            </p>
          </div>

          <label className={styles.fileInput}>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".json,.csv"
              onChange={handleImport}
              disabled={importing}
            />
            <span className={styles.fileInputLabel}>
              {importing ? 'Importing...' : 'Choose File (JSON or CSV)'}
            </span>
          </label>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

// Helper functions
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === ',') {
        result.push(cur);
        cur = '';
      } else if (ch === '"') {
        inQuotes = true;
      } else {
        cur += ch;
      }
    }
  }
  result.push(cur);
  return result;
}

function parseAuthors(authors: any): string[] {
  if (!authors) return [];
  if (Array.isArray(authors)) {
    return authors.map(a => typeof a === 'string' ? a : a.first_name || '').filter(Boolean);
  }
  if (typeof authors === 'string') {
    return authors.split(';').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function parseGenres(genres: any): string[] {
  if (!genres) return [];
  if (Array.isArray(genres)) {
    return genres.map(g => typeof g === 'string' ? g : g.name || '').filter(Boolean);
  }
  if (typeof genres === 'string') {
    return genres.split(';').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export default ImportExportScreen;
