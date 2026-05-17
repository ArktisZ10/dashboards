import { Box, Typography, Button } from '@mui/material'
import WidgetsIcon from '@mui/icons-material/Widgets'

interface EmptyStateProps {
  onAddWidget: () => void
}

export function EmptyState({ onAddWidget }: EmptyStateProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: 'text.secondary',
        py: 8,
      }}
    >
      <WidgetsIcon sx={{ fontSize: 64, opacity: 0.3 }} />
      <Typography variant="h6">No widgets yet</Typography>
      <Typography variant="body2">Add your first widget to get started.</Typography>
      <Button variant="contained" onClick={onAddWidget} startIcon={<WidgetsIcon />}>
        Add Widget
      </Button>
    </Box>
  )
}
