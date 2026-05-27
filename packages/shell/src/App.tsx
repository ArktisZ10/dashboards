import { useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { CssVarsProvider, useColorScheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { muiTheme } from './theme'
import { dashboardAtom, themeAtom } from './store'
import { useDashboardPersistence } from './hooks/useDashboardPersistence'
import { DashboardAppBar } from './components/AppBar'
import { DashboardGrid } from './components/DashboardGrid'
import { AddWidgetFab, AddWidgetDrawer } from './components/AddWidgetDrawer'
import { EmptyState } from './components/EmptyState'

function ThemeModeSync() {
  const themeMode = useAtomValue(themeAtom)
  const { setMode } = useColorScheme()
  useEffect(() => { setMode(themeMode) }, [themeMode, setMode])
  return null
}

function DashboardContent() {
  const dashboard = useAtomValue(dashboardAtom)
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1200)

  useDashboardPersistence()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width)
    })

    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  return (
    <Box ref={containerRef} sx={{ flex: 1, overflow: 'auto', px: 2, pb: 4, pt: 1 }}>
      {dashboard.widgets.length === 0 ? (
        <EmptyState onAddWidget={() => setAddDrawerOpen(true)} />
      ) : (
        <DashboardGrid width={width} />
      )}
      <AddWidgetFab onOpen={() => setAddDrawerOpen(true)} />
      <AddWidgetDrawer open={addDrawerOpen} onClose={() => setAddDrawerOpen(false)} />
    </Box>
  )
}

export default function App() {
  return (
    <CssVarsProvider theme={muiTheme} defaultMode="dark">
      <ThemeModeSync />
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <DashboardAppBar />
        <DashboardContent />
      </Box>
    </CssVarsProvider>
  )
}
