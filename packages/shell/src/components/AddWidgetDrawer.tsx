import { useAtom } from 'jotai'
import { Drawer, List, ListItem, ListItemText, ListItemButton, Typography, Box, Fab, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { v4 as uuidv4 } from 'uuid'
import { dashboardAtom } from '../store'
import { getAllWidgets } from '../registry'

interface AddWidgetDrawerProps {
  open: boolean
  onClose: () => void
}

export function AddWidgetDrawer({ open, onClose }: AddWidgetDrawerProps) {
  const [, setDashboard] = useAtom(dashboardAtom)

  const handleAdd = (widgetType: string) => {
    const module = getAllWidgets().find((w) => w.meta.id === widgetType)
    if (!module) return

    const { w, h } = module.meta.defaultSize
    setDashboard((prev) => ({
      ...prev,
      widgets: [
        ...prev.widgets,
        {
          instanceId: uuidv4(),
          widgetType,
          layout: { x: 0, y: Infinity, w, h },
          config: {},
        },
      ],
    }))
    onClose()
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Widget
        </Typography>
        <List>
          {getAllWidgets().map((mod) => (
            <ListItem key={mod.meta.id} disablePadding>
              <ListItemButton onClick={() => handleAdd(mod.meta.id)}>
                <ListItemText primary={mod.meta.name} secondary={mod.meta.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

interface AddWidgetFabProps {
  onOpen: () => void
}

export function AddWidgetFab({ onOpen }: AddWidgetFabProps) {
  return (
    <Tooltip title="Add widget">
      <Fab
        color="primary"
        size="medium"
        onClick={onOpen}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  )
}
