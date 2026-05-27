import { extendTheme } from '@mui/material/styles'

export const muiTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1976d2' },
        background: { default: '#f5f5f5', paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#90caf9' },
        background: { default: '#0a0a0a', paper: '#1e1e1e' },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
})
