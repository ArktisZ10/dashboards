import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { dashboardAtom, themeAtom, STORAGE_KEY } from '../store'

export function useDashboardPersistence() {
  const [dashboard] = useAtom(dashboardAtom)
  const [theme] = useAtom(themeAtom)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboard))
    } catch {
      /* ignore quota errors */
    }
  }, [dashboard])

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme)
  }, [theme])
}

export function exportDashboard(dashboard: object) {
  const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dashboard-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importDashboard(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target!.result as string))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
