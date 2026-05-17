import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material'
import type { WidgetModule } from '@dashboard/sdk'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface WidgetConfigDialogProps {
  open: boolean
  widgetModule: WidgetModule
  currentConfig: Record<string, unknown>
  onSave: (config: Record<string, unknown>) => void
  onClose: () => void
}

export function WidgetConfigDialog({
  open,
  widgetModule,
  currentConfig,
  onSave,
  onClose,
}: WidgetConfigDialogProps) {
  const schema = widgetModule.configSchema
  const ConfigPanel = widgetModule.ConfigPanel
  const [localConfig, setLocalConfig] = React.useState<Record<string, unknown>>(currentConfig)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    defaultValues: currentConfig,
    resolver: schema ? zodResolver(schema as z.ZodObject<z.ZodRawShape>) : undefined,
  })

  React.useEffect(() => {
    setLocalConfig(currentConfig)
    reset(currentConfig)
  }, [currentConfig, open, reset])

  const onSubmit = (data: Record<string, unknown>) => onSave(data)

  if (ConfigPanel) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configure {widgetModule.meta.name}</DialogTitle>
        <DialogContent>
          <ConfigPanel config={localConfig} onChange={setLocalConfig} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => onSave(localConfig)}>Save</Button>
        </DialogActions>
      </Dialog>
    )
  }

  if (!schema || !(schema instanceof z.ZodObject)) return null

  const shape = schema.shape

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure {widgetModule.meta.name}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {Object.entries(shape).map(([key, fieldSchema]) => {
              const zodField = fieldSchema as z.ZodTypeAny
              const isOptional = zodField instanceof z.ZodOptional
              const innerType = isOptional ? zodField.unwrap() : zodField
              const fieldType = innerType instanceof z.ZodNumber ? 'number' : 'text'
              const errorMsg = errors[key]?.message as string | undefined

              return (
                <TextField
                  key={key}
                  label={key}
                  type={fieldType}
                  error={!!errorMsg}
                  helperText={errorMsg}
                  {...register(key, { valueAsNumber: fieldType === 'number' })}
                  size="small"
                  fullWidth
                />
              )
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
