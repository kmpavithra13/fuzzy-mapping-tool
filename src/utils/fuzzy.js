// ── String normalizer ──────────────────────────────────────────────
function normalize(s) {
  return String(s).toLowerCase().trim()
    .replace(/[.,\-_]/g, ' ')
    .replace(/\s+/g, ' ')
}

function tokenSort(s) {
  return normalize(s).split(' ').sort().join(' ')
}

// ── Levenshtein ratio (0-100) ──────────────────────────────────────
function levenshtein(a, b) {
  a = normalize(a); b = normalize(b)
  if (a === b) return 100
  if (!a || !b) return 0
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (j === 0 ? i : i === 0 ? j : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
  return Math.round((1 - dp[m][n] / Math.max(m, n)) * 100)
}

// ── Partial ratio ──────────────────────────────────────────────────
function partialRatio(a, b) {
  a = normalize(a); b = normalize(b)
  if (a.length > b.length) [a, b] = [b, a]
  let best = 0
  for (let i = 0; i <= b.length - a.length; i++) {
    const s = levenshtein(a, b.slice(i, i + a.length))
    if (s > best) best = s
  }
  return best
}

// ── Token set ratio ────────────────────────────────────────────────
function tokenSetRatio(a, b) {
  const sa = new Set(normalize(a).split(' ').filter(Boolean))
  const sb = new Set(normalize(b).split(' ').filter(Boolean))
  const inter = [...sa].filter(x => sb.has(x)).sort().join(' ')
  const ra = [...sa].filter(x => !sb.has(x)).sort().join(' ')
  const rb = [...sb].filter(x => !sa.has(x)).sort().join(' ')
  return Math.max(
    levenshtein(inter, inter + ' ' + ra),
    levenshtein(inter, inter + ' ' + rb),
    levenshtein(inter + ' ' + ra, inter + ' ' + rb)
  )
}

// ── Best score across all methods ─────────────────────────────────
function bestScore(val, candidate) {
  return Math.max(
    levenshtein(val, candidate),
    partialRatio(val, candidate),
    levenshtein(tokenSort(val), tokenSort(candidate)),
    tokenSetRatio(val, candidate)
  )
}

// ── Find best match from a reference list ─────────────────────────
export function findBestMatch(value, refList) {
  let bestMatch = '', best = 0
  for (const ref of refList) {
    const s = bestScore(String(value), String(ref))
    if (s > best) { best = s; bestMatch = ref }
  }
  return { match: bestMatch, score: best }
}

// ── Run matching for multiple column pairs ─────────────────────────
export function runFuzzyMatch(datasetRows, refRows, pairs, threshold) {
  const results = []

  for (const { dsCol, refCol } of pairs) {
    const refList = [...new Set(
      refRows.map(r => String(r[refCol] ?? '').trim()).filter(Boolean)
    )]

    // Cache unique values for speed
    const cache = {}
    const rows = []

    for (const row of datasetRows) {
      const orig = String(row[dsCol] ?? '').trim()
      if (!orig) {
        rows.push({ original: orig, matched: '', score: 0, flag: 'Missing' })
        continue
      }
      if (!cache[orig]) {
        const { match, score } = findBestMatch(orig, refList)
        cache[orig] = { match, score, flag: score >= threshold ? 'OK' : 'Review Required' }
      }
      rows.push({ original: orig, ...cache[orig] })
    }

    // Unique rows for display
    const uniqueMap = new Map()
    rows.forEach(r => { if (!uniqueMap.has(r.original)) uniqueMap.set(r.original, r) })

    results.push({
      dsCol,
      refCol,
      refList,
      rows,
      uniqueRows: [...uniqueMap.values()].sort((a, b) => a.score - b.score),
      ok:     rows.filter(r => r.flag === 'OK').length,
      review: rows.filter(r => r.flag === 'Review Required').length,
    })
  }

  return results
}

// ── Apply corrections and build final dataset ──────────────────────
export function applyCorrections(datasetRows, matchResults, corrections) {
  const corrMap = {}
  corrections.forEach(c => {
    corrMap[`${c.dsCol}::${c.originalValue}`] = c.correctedValue
  })

  return datasetRows.map(row => {
    const out = { ...row }
    for (const result of matchResults) {
      const { dsCol, rows } = result
      const orig = String(row[dsCol] ?? '').trim()
      const matchRow = rows.find(r => r.original === orig)
      const corrKey = `${dsCol}::${orig}`

      if (corrMap[corrKey]) {
        out[`${dsCol}_standardized`] = corrMap[corrKey]
        out[`${dsCol}_score`] = matchRow?.score ?? 0
        out[`${dsCol}_flag`] = 'Corrected'
      } else if (matchRow) {
        out[`${dsCol}_standardized`] = matchRow.matched
        out[`${dsCol}_score`] = matchRow.score
        out[`${dsCol}_flag`] = matchRow.flag
      }
    }
    return out
  })
}
