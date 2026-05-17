import { createTheme } from '@mui/material/styles'

export function buildMuiTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#90caf9' },
      background: {
        default: mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  })
}

export function applyThemeCssVars(theme: ReturnType<typeof buildMuiTheme>) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.palette.primary.main)
  root.style.setProperty('--color-surface', theme.palette.background.paper)
  root.style.setProperty('--color-text', theme.palette.text.primary)
  root.style.setProperty('--color-text-secondary', theme.palette.text.secondary)
  root.style.setProperty('--color-border', theme.palette.divider)
  root.style.setProperty('--color-bg', theme.palette.background.default)
  root.style.setProperty('--spacing-unit', `${theme.spacing(1)}`)
  root.style.setProperty('--font-body', theme.typography.fontFamily ?? 'sans-serif')
}
