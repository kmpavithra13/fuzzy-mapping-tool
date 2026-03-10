import React from 'react'
import { exportCSV, exportXLSX } from '../utils/fileUtils'
import { applyCorrections } from '../utils/fuzzy'

export default function ExportPage({ dataset, matchResults, corrections, onBack, onReset }) {
  function getRows() {
    const corrList = Object.entries(corrections).map(([key, correctedValue]) => {
      const [dsCol, ...rest] = key.split('::')
      return { dsCol, originalValue: rest.join('::'), correctedValue }
    })
    return applyCorrections(dataset.rows, matchResults, corrList)
  }

  function handleCSV() {
    exportCSV(getRows(), 'standardized.csv')
  }

  function handleXLSX() {
    exportXLSX(getRows(), 'standardized.xlsx')
  }

  const totalOk     = matchResults.reduce((s, r) => s + r.ok, 0)
  const totalReview = matchResults.reduce((s, r) => s + r.review, 0)
  const corrCount   = Object.keys(corrections).length

  return (
    <div className="page-content">
      <div className="view-hero">
        <div className="hero-tag">Step 5 of 5</div>
        <h1 className="view-title">Download your cleaned file</h1>
        <p className="view-desc">
          Your file is ready. It includes all original columns plus new standardized
          columns, match scores, and status flags for every row.
        </p>
      </div>

      {/* Summary card */}
      <div className="export-summary-card">
        <div className="esc-title">What's included in your download</div>
        <div className="esc-stats">
          <div className="esc-stat">
            <div className="esc-num green">{totalOk.toLocaleString()}</div>
            <div className="esc-label">Auto-matched</div>
          </div>
          <div className="esc-stat">
            <div className="esc-num blue">{corrCount}</div>
            <div className="esc-label">Manually corrected</div>
          </div>
          <div className="esc-stat">
            <div className="esc-num">{dataset.rowCount.toLocaleString()}</div>
            <div className="esc-label">Total rows</div>
          </div>
        </div>
        <div className="esc-cols">
          {matchResults.map(r => (
            <div key={r.dsCol} className="esc-col-row">
              <span className="esc-col-name">{r.dsCol}</span>
              <span className="esc-col-adds">
                + <code>{r.dsCol}_standardized</code>
                &nbsp;·&nbsp; <code>{r.dsCol}_score</code>
                &nbsp;·&nbsp; <code>{r.dsCol}_flag</code>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Download cards */}
      <div className="export-grid">
        <div className="export-card csv" onClick={handleCSV}>
          <div className="export-card-icon">📄</div>
          <div className="export-card-title">Download CSV</div>
          <div className="export-card-desc">
            Universal format — works with Excel, Google Sheets, Python, R, and any data tool
          </div>
          <div className="export-card-btn">Download .csv</div>
        </div>
        <div className="export-card xlsx" onClick={handleXLSX}>
          <div className="export-card-icon">📊</div>
          <div className="export-card-title">Download Excel</div>
          <div className="export-card-desc">
            Native .xlsx format — opens directly in Microsoft Excel
          </div>
          <div className="export-card-btn">Download .xlsx</div>
        </div>
      </div>

      <div className="view-actions" style={{ marginTop: '2rem' }}>
        <button className="btn-secondary" onClick={onBack}>← Back to Corrections</button>
        <button className="btn-ghost" onClick={onReset}>Start a new project</button>
      </div>
    </div>
  )
}
