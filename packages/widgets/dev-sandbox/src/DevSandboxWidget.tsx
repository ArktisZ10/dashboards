import { Box, Typography, Chip, Stack } from '@mui/material'
import type { WidgetProps } from '@dashboard/sdk'
import { devSandboxConfigSchema } from './schema'

export function DevSandboxWidget({ config }: WidgetProps) {
  const parsed = devSandboxConfigSchema.safeParse(config)
  const { label, volume, accentColor, bio, mode, tags, internalId } = parsed.success
    ? parsed.data
    : devSandboxConfigSchema.parse({})

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="overline" sx={{ color: 'warning.main' }}>⚠ DEV SANDBOX</Typography>
      <Typography variant="h6" sx={{ color: accentColor, mb: 1 }}>{label}</Typography>

      <Stack spacing={0.5}>
        <Typography variant="body2"><b>mode:</b> {mode}</Typography>
        <Typography variant="body2"><b>volume:</b> {volume}</Typography>
        {bio && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{bio}</Typography>}
        {tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
            {tags.map(t => <Chip key={t} label={t} size="small" />)}
          </Stack>
        )}
        {mode === 'debug' && (
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>id: {internalId}</Typography>
        )}
      </Stack>
    </Box>
  )
}
