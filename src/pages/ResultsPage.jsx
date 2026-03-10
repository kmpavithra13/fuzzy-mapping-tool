import React, { useState } from 'react'

function ScoreBar({ score }) {
  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--rose)'
  return (
    <div className="score-cell">
      <div className="score-track">
        <div className="score-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="score-val" style={{ color }}>{score}</span>
    </div>
  )
}

function StatusBadge({ flag }) {
  const map = {
    'OK':               { cls: 'ok',        icon: '✓' },
    'Review Required':  { cls: 'review',    icon: '⚠' },
    'Missing':          { cls: 'missing',   icon: '—' },
    'Corrected':        { cls: 'corrected', icon: '✎' },
  }
  const { cls, icon } = map[flag] || map['Missing']
  return <span className={`sbadge ${cls}`}>{icon} {flag}</span>
}

export default function ResultsPage({ matchResults, onNext, onBack }) {
  const [activeTab, setActiveTab] = useState(0)

  const totalRows   = matchResults.reduce((s, r) => s + r.rows.length, 0)
  const totalOk     = matchResults.reduce((s, r) => s + r.ok, 0)
  const totalReview = matchResults.reduce((s, r) => s + r.review, 0)
  const allScores   = matchResults.flatMap(r => r.rows.map(x => x.score))
  const avgScore    = allScores.length
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0

  const pair = matchResults[activeTab]

  return (
    <div className="page-content">
      <div className="view-hero">
        <div className="hero-tag">Step 3 of 5</div>
        <h1 className="view-title">Matching results</h1>
        <p className="view-desc">
          Review how your values were matched. Switch between column pairs using the tabs below.
          {totalReview > 0 && <> <strong style={{ color: 'var(--amber)' }}>{totalReview} rows need your review.</strong></>}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { cls: 'total',  num: totalRows.toLocaleString(),   label: 'Total Rows',   icon: '📋' },
          { cls: 'ok',     num: totalOk.toLocaleString(),     label: 'Matched OK',   icon: '✅' },
          { cls: 'review', num: totalReview.toLocaleString(), label: 'Needs Review', icon: '⚠️' },
          { cls: 'avg',    num: avgScore,                     label: 'Avg Score',    icon: '🎯' },
        ].map(s => (
          <div key={s.cls} className={`stat-card ${s.cls}`}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div className="results-card">
        <div className="results-tabs">
          {matchResults.map((r, i) => (
            <button
              key={i}
              className={`rtab ${i === activeTab ? 'on' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {r.dsCol}
              {r.review > 0 && <span className="rtab-badge">{r.review}</span>}
            </button>
          ))}
        </div>

        <div className="results-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Original Value</th>
                <th>Standardized To</th>
                <th style={{ minWidth: '130px' }}>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pair.uniqueRows.map((row, i) => (
                <tr key={i}>
                  <td className="cell-muted" title={row.original}>
                    {row.original || <em style={{ color: 'var(--ink3)' }}>empty</em>}
                  </td>
                  <td><strong>{row.matched || '—'}</strong></td>
                  <td><ScoreBar score={row.score} /></td>
                  <td><StatusBadge flag={row.flag} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="view-actions">
        <button className="btn-secondary" onClick={onBack}>← Reconfigure</button>
        <button className="btn-primary" onClick={onNext}>
          Review Flagged Rows <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
