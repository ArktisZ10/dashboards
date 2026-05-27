import React from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box,
  Switch, FormControlLabel, Tabs, Tab, Select, MenuItem, InputLabel, FormControl,
  FormHelperText, Slider, Typography, Divider,
} from '@mui/material'
import { MuiColorInput } from 'mui-color-input'
import Editor from '@monaco-editor/react'
import { useAtomValue } from 'jotai'
import { themeAtom } from '../store'
import type { WidgetModule } from '@dashboard/sdk'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface WidgetConfigDialogProps {
  open: boolean
  widgetModule: WidgetModule
  currentConfig: Record<string, unknown>
  onSave: (config: Record<string, unknown>) => void
  onClose: () => void
}

function unwrapZod(field: z.ZodTypeAny): z.ZodTypeAny {
  if (field instanceof z.ZodOptional || field instanceof z.ZodNullable) return unwrapZod(field.unwrap())
  if (field instanceof z.ZodDefault) return unwrapZod(field._def.innerType as z.ZodTypeAny)
  return field
}

function getNumberBounds(field: z.ZodNumber): { min?: number; max?: number } {
  const min = field._def.checks.find((c: { kind: string }) => c.kind === 'min') as { value: number } | undefined
  const max = field._def.checks.find((c: { kind: string }) => c.kind === 'max') as { value: number } | undefined
  return { min: min?.value, max: max?.value }
}

function getSchemaDefaults(schema: z.ZodTypeAny): Record<string, unknown> {
  if (!(schema instanceof z.ZodObject)) return {}
  return Object.fromEntries(
    Object.entries((schema as z.ZodObject<z.ZodRawShape>).shape)
      .flatMap(([k, v]) => {
        if (v instanceof z.ZodDefault) return [[k, v._def.defaultValue()]]
        return []
      })
  )
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
  const themeMode = useAtomValue(themeAtom)
  const monacoTheme = themeMode === 'dark' ? 'vs-dark' : 'light'
  const [tab, setTab] = React.useState(0)
  const [panelConfig, setPanelConfig] = React.useState<Record<string, unknown>>({})
  const [jsonText, setJsonText] = React.useState('')
  const [jsonError, setJsonError] = React.useState<string | null>(null)

  const initialValues = React.useMemo(
    () => ({ ...getSchemaDefaults(schema as z.ZodTypeAny), ...currentConfig }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentConfig, open],
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    defaultValues: initialValues,
    resolver: schema ? zodResolver(schema as z.ZodObject<z.ZodRawShape>) : undefined,
  })

  const formValues = watch()

  const mergedConfig = React.useMemo(
    () => ({ ...formValues, ...panelConfig }),
    [formValues, panelConfig],
  )

  const validationErrors = React.useMemo((): Record<string, string[]> => {
    if (!schema) return {}
    const result = schema.safeParse(mergedConfig)
    if (result.success) return {}
    return result.error.flatten().fieldErrors as Record<string, string[]>
  }, [schema, mergedConfig])

  React.useEffect(() => {
    setPanelConfig({})
    reset(initialValues)
    setJsonText(JSON.stringify(initialValues, null, 2))
    setJsonError(null)
    setTab(0)
  }, [currentConfig, open, reset])

  const mergedConfigRef = React.useRef(mergedConfig)
  mergedConfigRef.current = mergedConfig

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    if (newTab === 1) setJsonText(JSON.stringify(mergedConfigRef.current, null, 2))
    setTab(newTab)
  }

  const onSubmitForm = (data: Record<string, unknown>) => {
    onSave({ ...data, ...panelConfig })
  }

  const onSubmitJson = () => {
    try {
      const parsed = JSON.parse(jsonText)
      if (schema) {
        const result = schema.safeParse(parsed)
        if (!result.success) {
          setJsonError(result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n'))
          return
        }
        onSave(result.data as Record<string, unknown>)
      } else {
        onSave(parsed)
      }
    } catch {
      setJsonError('Invalid JSON')
    }
  }

  const renderField = (key: string, fieldSchema: z.ZodTypeAny) => {
    const innerType = unwrapZod(fieldSchema)
    // Read hint from original field (may be on ZodDefault wrapper), fallback to unwrapped type
    const hint = fieldSchema.description ?? innerType.description ?? ''
    const errorMsg = errors[key]?.message as string | undefined

    if (hint === 'hidden') return null

    // Hint-gated flair
    if (hint === 'slider' && innerType instanceof z.ZodNumber) {
      const { min, max } = getNumberBounds(innerType)
      return (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <Box>
            <Typography variant="caption">{key}</Typography>
            <Slider
              value={typeof field.value === 'number' ? field.value : (min ?? 0)}
              min={min} max={max} step={1}
              onChange={(_, v) => field.onChange(v)}
              valueLabelDisplay="auto"
            />
            {errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
          </Box>
        )} />
      )
    }
    if (hint === 'color' && innerType instanceof z.ZodString) {
      return (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <MuiColorInput
            label={key}
            size="small"
            fullWidth
            error={!!errorMsg}
            helperText={errorMsg}
            value={typeof field.value === 'string' ? field.value : '#000000'}
            onChange={val => field.onChange(val)}
            format="hex"
          />
        )} />
      )
    }
    if (hint === 'password' && innerType instanceof z.ZodString) {
      return (
        <TextField key={key} label={key} type="password" error={!!errorMsg} helperText={errorMsg}
          {...register(key)} size="small" fullWidth />
      )
    }
    if (hint === 'multiline' && innerType instanceof z.ZodString) {
      return (
        <TextField key={key} label={key} multiline rows={3} error={!!errorMsg} helperText={errorMsg}
          {...register(key)} size="small" fullWidth />
      )
    }

    // Auto-detection
    if (innerType instanceof z.ZodBoolean) {
      return (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <FormControlLabel label={key}
            control={<Switch checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />}
          />
        )} />
      )
    }
    if (innerType instanceof z.ZodEnum) {
      const options = innerType.options as string[]
      return (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <FormControl size="small" fullWidth error={!!errorMsg}>
            <InputLabel>{key}</InputLabel>
            <Select label={key} value={field.value ?? ''} onChange={e => field.onChange(e.target.value)}>
              {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
            {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
          </FormControl>
        )} />
      )
    }
    if (innerType instanceof z.ZodArray && unwrapZod(innerType.element) instanceof z.ZodEnum) {
      const options = (unwrapZod(innerType.element) as z.ZodEnum<[string, ...string[]]>).options as string[]
      return (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <FormControl size="small" fullWidth error={!!errorMsg}>
            <InputLabel>{key}</InputLabel>
            <Select label={key} multiple value={Array.isArray(field.value) ? field.value : []}
              onChange={e => field.onChange(e.target.value)}>
              {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
            {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
          </FormControl>
        )} />
      )
    }
    if (innerType instanceof z.ZodNumber) {
      return (
        <TextField key={key} label={key} type="number" error={!!errorMsg} helperText={errorMsg}
          {...register(key, { valueAsNumber: true })} size="small" fullWidth />
      )
    }
    return (
      <TextField key={key} label={key} type="text" error={!!errorMsg} helperText={errorMsg}
        {...register(key)} size="small" fullWidth />
    )
  }

  const hasSchema = !!schema && schema instanceof z.ZodObject

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configure {widgetModule.meta.name}</DialogTitle>
      <Tabs value={tab} onChange={handleTabChange} sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Form" />
        <Tab label="JSON" />
      </Tabs>

      {tab === 0 && (
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {hasSchema && Object.entries((schema as z.ZodObject<z.ZodRawShape>).shape).map(([key, fieldSchema]) =>
                renderField(key, fieldSchema as z.ZodTypeAny)
              )}
              {ConfigPanel && hasSchema && <Divider />}
              {ConfigPanel && (
                <ConfigPanel config={mergedConfig} onChange={setPanelConfig} validationErrors={validationErrors} />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      )}

      {tab === 1 && (
        <>
          <DialogContent sx={{ p: 0 }}>
            <Editor
              height="400px"
              language="json"
              theme={monacoTheme}
              value={jsonText}
              onChange={v => { setJsonText(v ?? ''); setJsonError(null) }}
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
            {jsonError && (
              <Box sx={{ px: 2, py: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
                <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap' }}>{jsonError}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={onSubmitJson}>Save</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
