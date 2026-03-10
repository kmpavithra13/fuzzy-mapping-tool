import React, { useRef, useState } from 'react'
import { parseFile } from '../utils/fileUtils'

function DropZone({ type, label, tag, tagColor, icon, file, onFile, onReplace }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()

  async function handle(f) {
    if (!f) return
    setLoading(true)
    try {
      const parsed = await parseFile(f)
      onFile(parsed)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-card">
      <div className="uc-header">
        <div className={`uc-badge ${tagColor}`}>{tag}</div>
        {file && <div className="uc-meta">{file.rowCount.toLocaleString()} rows · {file.cols.length} cols</div>}
      </div>

      <div
        className={`drop-zone ${dragging ? 'dragover' : ''} ${file ? 'has-file' : ''}`}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]) }}
      >
        <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }}
          onChange={e => handle(e.target.files[0])} />

        {loading && (
          <div className="dz-state">
            <div className="spinner" />
            <div className="dz-state-text">Reading file…</div>
          </div>
        )}

        {!loading && !file && (
          <div className="dz-state">
            <div className="dz-icon">{icon}</div>
            <div className="dz-title">{label}</div>
            <div className="dz-sub">Drop your file here or click to browse</div>
            <div className="dz-formats">CSV · Excel (.xlsx)</div>
            <div className="dz-cta">Choose file</div>
          </div>
        )}

        {!loading && file && (
          <div className="dz-state dz-success">
            <div className="dz-check">✓</div>
            <div className="dz-success-name">{file.filename}</div>
            <div className="dz-success-info">{file.rowCount.toLocaleString()} rows · {file.cols.length} columns</div>
            <button className="dz-replace-btn" onClick={e => { e.stopPropagation(); onReplace() }}>
              Replace file
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="preview-section">
          <div className="preview-label">
            Preview <span className="preview-pill">first 5 rows</span>
          </div>
          <div className="preview-scroll">
            <table className="data-table">
              <thead>
                <tr>{file.cols.slice(0, 7).map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {file.rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {file.cols.slice(0, 7).map(c => (
                      <td key={c} title={String(row[c] ?? '')}>{String(row[c] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UploadPage({ dataset, reference, onUpdate, onNext }) {
  return (
    <div className="page-content">
      <div className="view-hero">
        <div className="hero-tag">Step 1 of 5</div>
        <h1 className="view-title">Upload your files</h1>
        <p className="view-desc">
          You need two files — the messy data you want to clean, and a reference dictionary
          with the correct standard values to match against.
        </p>
      </div>

      <div className="upload-grid">
        <DropZone
          type="dataset"
          label="Drop your data file here"
          tag="Your Data File"
          tagColor="violet"
          icon="📂"
          file={dataset}
          onFile={f => onUpdate({ dataset: f })}
          onReplace={() => onUpdate({ dataset: null })}
        />
        <DropZone
          type="reference"
          label="Drop your reference file here"
          tag="Reference / Dictionary"
          tagColor="amber"
          icon="📖"
          file={reference}
          onFile={f => onUpdate({ reference: f })}
          onReplace={() => onUpdate({ reference: null })}
        />
      </div>

      <div className="info-banner">
        <span className="ib-icon">💡</span>
        <div>
          <strong>What's a reference file?</strong> A spreadsheet with the correct, standardized
          values — e.g. a column of valid country names or state names. FuzzyMap will
          automatically match your messy data against these values, even with typos or abbreviations.
        </div>
      </div>

      <div className="info-banner" style={{ background: 'var(--green-l)', borderColor: '#6ee7b7' }}>
        <span className="ib-icon">🔒</span>
        <div>
          <strong>Your data stays private.</strong> Everything runs in your browser — no files
          are uploaded to any server.
        </div>
      </div>

      <div className="view-actions">
        <button
          className="btn-primary"
          disabled={!dataset || !reference}
          onClick={onNext}
        >
          Continue to Configure <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
