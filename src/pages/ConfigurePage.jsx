import React, { useState } from 'react'
import { runFuzzyMatch } from '../utils/fuzzy'

export default function ConfigurePage({ dataset, reference, pairs, threshold, onUpdate, addPair, removePair, updatePair, onNext, onBack }) {
  const [running, setRunning] = useState(false)

  function handleRun() {
    const validPairs = pairs.filter(p => p.dsCol && p.refCol)
    if (!validPairs.length) { alert('Please configure at least one column pair.'); return }

    setRunning(true)
    // Use setTimeout so the UI updates before the heavy computation
    setTimeout(() => {
      try {
        const results = runFuzzyMatch(dataset.rows, reference.rows, validPairs, threshold)
        onUpdate({ matchResults: results, corrections: {} })
        onNext()
      } catch (e) {
        alert('Matching failed: ' + e.message)
      } finally {
        setRunning(false)
      }
    }, 50)
  }

  return (
    <div className="page-content">
      <div className="view-hero">
        <div className="hero-tag">Step 2 of 5</div>
        <h1 className="view-title">Configure column mappings</h1>
        <p className="view-desc">
          Link each messy column in your data file to the correct values column in your
          dictionary. Add as many pairs as you need — for example, both a state column
          and a country column at the same time.
        </p>
      </div>

      {/* Column Pairs */}
      <div className="config-card">
        <div className="config-card-head">
          <div className="cch-title">🔗 Column Pairs</div>
          <div className="cch-desc">Each row maps one messy column → one reference column</div>
        </div>

        <div className="pairs-container">
          {pairs.map((pair, i) => (
            <div key={pair.id} className="pair-row">
              <div className="pair-col">
                <span className="pair-col-label violet">📂 From your data file</span>
                <select
                  value={pair.dsCol}
                  onChange={e => updatePair(pair.id, 'dsCol', e.target.value)}
                >
                  <option value="">— select column —</option>
                  {dataset.cols.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="pair-arrow">→</div>

              <div className="pair-col">
                <span className="pair-col-label amber">📖 From dictionary</span>
                <select
                  value={pair.refCol}
                  onChange={e => updatePair(pair.id, 'refCol', e.target.value)}
                >
                  <option value="">— select column —</option>
                  {reference.cols.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="pair-del-col">
                <button
                  className="pair-del-btn"
                  onClick={() => removePair(pair.id)}
                  title="Remove"
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pairs-footer">
          <button className="btn-add-pair" onClick={addPair}>
            ＋ Add another column pair
          </button>
        </div>
      </div>

      {/* Threshold */}
      <div className="config-card" style={{ marginTop: '1.5rem' }}>
        <div className="config-card-head">
          <div className="cch-title">🎯 Match Confidence Threshold</div>
          <div className="cch-desc">Matches scoring below this number will be flagged for manual review</div>
        </div>
        <div className="threshold-body">
          <div className="threshold-display">
            <div className="thresh-num">{threshold}</div>
            <div className="thresh-label">/ 100</div>
          </div>
          <div className="threshold-slider-wrap">
            <input
              type="range" min="50" max="99" value={threshold}
              onChange={e => onUpdate({ threshold: parseInt(e.target.value) })}
            />
            <div className="thresh-marks">
              <span>50 — Loose</span>
              <span>75 — Balanced</span>
              <span>99 — Strict</span>
            </div>
          </div>
        </div>
      </div>

      <div className="view-actions">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={handleRun} disabled={running}>
          {running
            ? <><span className="btn-spinner" /> Running…</>
            : <>✨ Run Matching</>
          }
        </button>
      </div>
    </div>
  )
}
