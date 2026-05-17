import { useRef } from 'react'
import { useAtom } from 'jotai'
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Tooltip, Box } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { themeAtom, dashboardAtom } from '../store'
import type { DashboardState } from '../store'
import { exportDashboard, importDashboard } from '../hooks/useDashboardPersistence'

export function DashboardAppBar() {
  const [themeMode, setThemeMode] = useAtom(themeAtom)
  const [dashboard, setDashboard] = useAtom(dashboardAtom)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await importDashboard(file)
      setDashboard(data as DashboardState)
    } catch {
      alert('Failed to import dashboard file')
    }

    e.target.value = ''
  }

  return (
    <MuiAppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar variant="dense">
        <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Import layout">
            <IconButton size="small" onClick={() => fileInputRef.current?.click()}>
              <FileUploadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <Tooltip title="Export layout">
            <IconButton size="small" onClick={() => exportDashboard(dashboard)}>
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={themeMode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
            <IconButton size="small" onClick={() => setThemeMode((m) => (m === 'dark' ? 'light' : 'dark'))}>
              {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
}
