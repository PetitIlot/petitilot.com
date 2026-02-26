export interface ExportRow {
  Date: string
  Ressource: string
  Ventes: number
  'Revenus (€)': string
}

export async function exportToExcel(data: ExportRow[], filename: string) {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Données')
  // Auto column widths
  const cols = [
    { wch: 12 }, // Date
    { wch: 30 }, // Ressource
    { wch: 10 }, // Ventes
    { wch: 14 }, // Revenus
  ]
  ws['!cols'] = cols
  XLSX.writeFile(wb, `${filename}.xlsx`)
}
