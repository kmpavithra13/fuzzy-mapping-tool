import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          if (!result.data.length) return reject(new Error('File is empty.'))
          resolve({
            rows: result.data,
            cols: Object.keys(result.data[0]),
            filename: file.name,
            rowCount: result.data.length,
          })
        },
        error: err => reject(err),
      })
    } else if (['xlsx', 'xls'].includes(ext)) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'array' })
          const ws = wb.Sheets[wb.SheetNames[0]]
          const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
          if (!data.length) return reject(new Error('File is empty.'))
          resolve({
            rows: data,
            cols: Object.keys(data[0]),
            filename: file.name,
            rowCount: data.length,
          })
        } catch (err) {
          reject(new Error('Could not read Excel file.'))
        }
      }
      reader.onerror = () => reject(new Error('Could not read file.'))
      reader.readAsArrayBuffer(file)
    } else {
      reject(new Error('Please upload a CSV or Excel (.xlsx) file.'))
    }
  })
}

export function exportCSV(rows, filename = 'standardized.csv') {
  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, filename)
}

export function exportXLSX(rows, filename = 'standardized.xlsx') {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Standardized')
  XLSX.writeFile(wb, filename)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
