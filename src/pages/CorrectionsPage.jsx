import React from 'react'

export default function CorrectionsPage({ matchResults, corrections, setCorrection, onNext, onBack }) {
  const reviewPairs = matchResults.filter(r => r.review > 0)

  return (
    <div className="page-content">
      <div className="view-hero">
        <div className="hero-tag">Step 4 of 5</div>
        <h1 className="view-title">Manual corrections</h1>
        <p className="view-desc">
          Rows flagged as <span className="inline-badge review">Review Required</span> are shown
          below. Use the dropdowns to select the correct value for each one.
        </p>
      </div>

      {reviewPairs.length === 0 ? (
        <div className="all-ok-card">
          <div className="aok-icon">🎉</div>
          <div>
            <div className="aok-title">All matches look great!</div>
            <div className="aok-desc">
              Every match scored above the confidence threshold.
              No corrections needed — you can go straight to exporting.
            </div>
          </div>
        </div>
      ) : (
        reviewPairs.map(result => {
          const unique = [...new Map(
            result.uniqueRows
              .filter(r => r.flag === 'Review Required')
              .map(r => [r.original, r])
          ).values()]

          return (
            <div key={result.dsCol} className="corr-block">
              <div className="corr-block-head">
                <div className="cbh-title">
                  Column: <strong>{result.dsCol}</strong>
                  <span style={{ color:'var(--ink3)', fontWeight:400 }}> → {result.refCol}</span>
                </div>
                <div className="cbh-count">⚠ {unique.length} to review</div>
              </div>

              <div className="corr-items">
                {unique.map(row => {
                  const corrKey = `${result.dsCol}::${row.original}`
                  const currentVal = corrections[corrKey] ?? row.matched

                  return (
                    <div key={row.original} className="corr-item">
                      <div className="corr-original" title={row.original}>
                        {row.original}
                      </div>
                      <div className="corr-arrow">→</div>
                      <select
                        className="corr-select"
                        value={currentVal}
                        onChange={e => setCorrection(result.dsCol, row.original, e.target.value)}
                      >
                        {result.refList.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}

      <div className="view-actions">
        <button className="btn-secondary" onClick={onBack}>← Back to Results</button>
        <button className="btn-primary" onClick={onNext}>
          Save & Export <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
