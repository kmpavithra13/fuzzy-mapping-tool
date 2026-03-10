import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { ToastContainer, useToast } from './components/Toast'
import { useAppState } from './hooks/useAppState'
import UploadPage     from './pages/UploadPage'
import ConfigurePage  from './pages/ConfigurePage'
import ResultsPage    from './pages/ResultsPage'
import CorrectionsPage from './pages/CorrectionsPage'
import ExportPage     from './pages/ExportPage'

const VIEW_ORDER = ['upload', 'configure', 'results', 'correct', 'export']

export default function App() {
  const { state, update, reset, addPair, removePair, updatePair, setCorrection } = useAppState()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toast } = useToast()

  const currentView = VIEW_ORDER[state.currentStep - 1]

  function navigate(view) {
    const step = VIEW_ORDER.indexOf(view) + 1
    if (step > 0) update({ currentStep: step })
    setMobileOpen(false)
  }

  function goNext() {
    if (state.currentStep < VIEW_ORDER.length)
      update({ currentStep: state.currentStep + 1 })
  }
  function goBack() {
    if (state.currentStep > 1)
      update({ currentStep: state.currentStep - 1 })
  }

  function handleReset() {
    if (confirm('Start a new project? All current data will be cleared.')) {
      reset()
      toast('Started a new project.', 'info')
    }
  }

  const breadcrumbs = {
    upload: 'Upload Files',
    configure: 'Configure Columns',
    results: 'Matching Results',
    correct: 'Manual Corrections',
    export: 'Export',
  }

  return (
    <div className="app-shell">
      <Sidebar
        currentStep={state.currentStep}
        matchResults={state.matchResults}
        onNavigate={navigate}
        onReset={handleReset}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="main-wrap">
        {/* Topbar */}
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setMobileOpen(o => !o)}>☰</button>
          <div className="topbar-breadcrumb">{breadcrumbs[currentView]}</div>
          <div className="topbar-right">
            <div className="progress-dots">
              {VIEW_ORDER.map((_, i) => (
                <div
                  key={i}
                  className={`pdot ${
                    i + 1 === state.currentStep ? 'active' :
                    i + 1 < state.currentStep ? 'done' : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="content-scroll">
          {currentView === 'upload' && (
            <UploadPage
              dataset={state.dataset}
              reference={state.reference}
              onUpdate={update}
              onNext={goNext}
            />
          )}
          {currentView === 'configure' && (
            <ConfigurePage
              dataset={state.dataset}
              reference={state.reference}
              pairs={state.pairs}
              threshold={state.threshold}
              onUpdate={update}
              addPair={addPair}
              removePair={removePair}
              updatePair={updatePair}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentView === 'results' && state.matchResults && (
            <ResultsPage
              matchResults={state.matchResults}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentView === 'correct' && state.matchResults && (
            <CorrectionsPage
              matchResults={state.matchResults}
              corrections={state.corrections}
              setCorrection={setCorrection}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentView === 'export' && state.matchResults && (
            <ExportPage
              dataset={state.dataset}
              matchResults={state.matchResults}
              corrections={state.corrections}
              onBack={goBack}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
