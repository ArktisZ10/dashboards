import { atom } from 'jotai'
import type { Layout } from 'react-grid-layout'

export interface WidgetInstance {
  instanceId: string
  widgetType: string
  layout: { x: number; y: number; w: number; h: number }
  config: Record<string, unknown>
}

export interface DashboardState {
  version: '1'
  widgets: WidgetInstance[]
}

const STORAGE_KEY = 'dashboard-state'

function loadInitialState(): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as DashboardState
  } catch {
    /* ignore */
  }
  return { version: '1', widgets: [] }
}

export const dashboardAtom = atom<DashboardState>(loadInitialState())

export const themeAtom = atom<'light' | 'dark'>(
  (localStorage.getItem('dashboard-theme') as 'light' | 'dark') ?? 'dark'
)

export const layoutAtom = atom((get) => {
  const dashboard = get(dashboardAtom)
  return dashboard.widgets.map((w): Layout => ({
    i: w.instanceId,
    x: w.layout.x,
    y: w.layout.y,
    w: w.layout.w,
    h: w.layout.h,
  }))
})

export { STORAGE_KEY }
