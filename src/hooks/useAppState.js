import { useState, useCallback } from 'react'

const initialState = {
  // Files
  dataset: null,   // { rows, cols, filename, rowCount }
  reference: null,

  // Config
  pairs: [{ id: 1, dsCol: '', refCol: '' }],
  threshold: 80,

  // Results
  matchResults: null,  // array of pair result objects
  corrections: {},     // { "dsCol::original": correctedValue }

  // Navigation
  currentStep: 1,
}

export function useAppState() {
  const [state, setState] = useState(initialState)

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => setState(initialState), [])

  // Pair management
  const addPair = useCallback(() => {
    setState(prev => ({
      ...prev,
      pairs: [...prev.pairs, { id: Date.now(), dsCol: '', refCol: '' }],
    }))
  }, [])

  const removePair = useCallback((id) => {
    setState(prev => ({
      ...prev,
      pairs: prev.pairs.length > 1
        ? prev.pairs.filter(p => p.id !== id)
        : prev.pairs,
    }))
  }, [])

  const updatePair = useCallback((id, field, value) => {
    setState(prev => ({
      ...prev,
      pairs: prev.pairs.map(p => p.id === id ? { ...p, [field]: value } : p),
    }))
  }, [])

  // Corrections
  const setCorrection = useCallback((dsCol, originalValue, correctedValue) => {
    setState(prev => ({
      ...prev,
      corrections: {
        ...prev.corrections,
        [`${dsCol}::${originalValue}`]: correctedValue,
      },
    }))
  }, [])

  return { state, update, reset, addPair, removePair, updatePair, setCorrection }
}
