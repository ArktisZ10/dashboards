import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { WidgetProps } from '@dashboard/sdk'
import { clockConfigSchema } from './schema'

export function ClockWidget({ config }: WidgetProps) {
  const parsed = clockConfigSchema.safeParse(config)
  const { locale, hour12 } = parsed.success ? parsed.data : { locale: 'sv-SE', hour12: false }

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = now.toLocaleTimeString(locale, { hour12 })
  const dateStr = now.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Typography variant="h2" component="div" sx={{ fontWeight: 300, letterSpacing: '-1px' }}>
        {timeStr}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {dateStr}
      </Typography>
    </Box>
  )
}
