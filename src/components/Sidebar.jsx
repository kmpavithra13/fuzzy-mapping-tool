import React from 'react'

const STEPS = [
  { id: 1, view: 'upload',    icon: '📂', label: 'Upload Files' },
  { id: 2, view: 'configure', icon: '⚙️', label: 'Configure' },
  { id: 3, view: 'results',   icon: '📊', label: 'Results' },
  { id: 4, view: 'correct',   icon: '✏️', label: 'Corrections' },
  { id: 5, view: 'export',    icon: '⬇️', label: 'Export' },
]

export default function Sidebar({ currentStep, matchResults, onNavigate, onReset, isMobileOpen, onMobileClose }) {
  const reviewCount = matchResults
    ? matchResults.reduce((s, r) => s + r.review, 0)
    : 0

  function getBadge(id) {
    if (id === 1 && currentStep > 1) return { text: '✓', type: 'ok' }
    if (id === 2 && currentStep > 2) return { text: '✓', type: 'ok' }
    if (id === 3 && currentStep > 3) return reviewCount > 0 ? { text: reviewCount, type: 'warn' } : { text: '✓', type: 'ok' }
    if (id === 4 && currentStep > 4) return { text: '✓', type: 'ok' }
    if (id === 3 && currentStep === 3 && reviewCount > 0) return { text: reviewCount, type: 'warn' }
    if (id === 4 && currentStep === 4 && reviewCount > 0) return { text: reviewCount, type: 'warn' }
    return null
  }

  function canNavigate(id) {
    if (id === 1) return true
    if (id === 2) return currentStep >= 2
    return currentStep >= id
  }

  return (
    <>
      {isMobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">FM</div>
          <div>
            <div className="logo-text">FuzzyMap</div>
            <div className="logo-sub">Data Standardization</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Workflow</div>
          {STEPS.map(step => {
            const badge = getBadge(step.id)
            const active = currentStep === step.id
            const accessible = canNavigate(step.id)
            return (
              <button
                key={step.id}
                className={`nav-item ${active ? 'active' : ''} ${!accessible ? 'disabled' : ''}`}
                onClick={() => { if (accessible) { onNavigate(step.view); onMobileClose?.() } }}
              >
                <span className="nav-icon">{step.icon}</span>
                <span className="nav-label">{step.label}</span>
                {badge && (
                  <span className={`nav-badge ${badge.type}`}>{badge.text}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-new-btn" onClick={onReset}>＋ New Project</button>
          <div className="sidebar-tagline">All processing happens in your browser — your data never leaves your device.</div>
        </div>
      </aside>
    </>
  )
}
