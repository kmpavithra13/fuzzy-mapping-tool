import { useState, useCallback, useEffect } from 'react'

let _addToast = null

export function useToast() {
  const addToast = useCallback((message, type = 'info') => {
    if (_addToast) _addToast({ message, type, id: Date.now() })
  }, [])
  return { toast: addToast }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (t) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500)
    }
    return () => { _addToast = null }
  }, [])

  const icons = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:999, display:'flex', flexDirection:'column', gap:'.5rem' }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icons[t.type]}</span> {t.message}
        </div>
      ))}
    </div>
  )
}
