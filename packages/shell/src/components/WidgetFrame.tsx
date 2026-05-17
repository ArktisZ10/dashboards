import { Component, useState } from 'react'
import { useAtom } from 'jotai'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import { dashboardAtom } from '../store'
import type { WidgetInstance } from '../store'
import { getWidget } from '../registry'
import { WidgetConfigDialog } from './WidgetConfigDialog'
import { useThemeMode } from '../hooks/useThemeMode'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<React.PropsWithChildren<{ name: string }>, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, color: 'error.main' }}>
          <Typography variant="caption">Widget error: {this.state.error?.message}</Typography>
        </Box>
      )
    }

    return this.props.children
  }
}

interface WidgetFrameProps {
  instance: WidgetInstance
}

export function WidgetFrame({ instance }: WidgetFrameProps) {
  const [, setDashboard] = useAtom(dashboardAtom)
  const [configOpen, setConfigOpen] = useState(false)
  const themeMode = useThemeMode()

  const widgetModule = getWidget(instance.widgetType)

  const handleRemove = () => {
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.instanceId !== instance.instanceId),
    }))
  }

  const handleConfigSave = (config: Record<string, unknown>) => {
    setDashboard((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.instanceId === instance.instanceId ? { ...w, config } : w
      ),
    }))
    setConfigOpen(false)
  }

  const WidgetComponent = widgetModule?.component

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          gap: 0.5,
        }}
      >
        <Tooltip title="Drag to move">
          <DragIndicatorIcon
            className="drag-handle"
            sx={{ cursor: 'grab', fontSize: 18, color: 'text.secondary' }}
          />
        </Tooltip>
        <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }}>
          {widgetModule?.meta.name ?? instance.widgetType}
        </Typography>
        {widgetModule?.configSchema && (
          <Tooltip title="Settings">
            <IconButton size="small" onClick={() => setConfigOpen(true)}>
              <SettingsIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Remove widget">
          <IconButton size="small" onClick={handleRemove}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {WidgetComponent ? (
          <ErrorBoundary name={instance.widgetType}>
            <WidgetComponent
              instanceId={instance.instanceId}
              config={instance.config}
              hostContext={{ theme: { mode: themeMode } }}
            />
          </ErrorBoundary>
        ) : (
          <Typography variant="caption" color="error">
            Unknown widget: {instance.widgetType}
          </Typography>
        )}
      </Box>

      {widgetModule?.configSchema && (
        <WidgetConfigDialog
          open={configOpen}
          widgetModule={widgetModule}
          currentConfig={instance.config}
          onSave={handleConfigSave}
          onClose={() => setConfigOpen(false)}
        />
      )}
    </Box>
  )
}
