import { useEffect, useState, useCallback } from 'react'
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableRow, TableCell } from '@mui/material'
import type { WidgetProps } from '@dashboard/sdk'
import { forecastConfigSchema } from './schema'
import { fetchSmhiForecast, type ForecastEntry } from './smhiApi'
import { weatherSymbolEmojis, weatherSymbolNames } from './weatherSymbols'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000

export function ForecastWidget({ config }: WidgetProps) {
  const parsed = forecastConfigSchema.safeParse(config)
  const { latitude, longitude, locationName } = parsed.success
    ? parsed.data
    : { latitude: 57.7, longitude: 11.97, locationName: 'Göteborg' }

  const [entries, setEntries] = useState<ForecastEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSmhiForecast(latitude, longitude)
      setEntries(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch forecast')
    } finally {
      setLoading(false)
    }
  }, [latitude, longitude])

  useEffect(() => {
    load()
    const id = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [load])

  if (loading && entries.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>
  }

  const now = entries[0]
  const upcoming = entries.slice(1, 7)

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 1 }}>
      {now && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">{locationName}</Typography>
          <Box sx={{ fontSize: 48 }}>{weatherSymbolEmojis[now.wsymb2]}</Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 300 }}>
            {Math.round(now.temp)}°C
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {weatherSymbolNames[now.wsymb2]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Wind {now.windSpeed.toFixed(1)} m/s
          </Typography>
        </Box>
      )}

      <Table size="small">
        <TableBody>
          {upcoming.map((entry) => (
            <TableRow key={entry.time.toISOString()}>
              <TableCell sx={{ py: 0.5, pl: 0 }}>
                {entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>{weatherSymbolEmojis[entry.wsymb2]}</TableCell>
              <TableCell sx={{ py: 0.5 }}>{Math.round(entry.temp)}°C</TableCell>
              <TableCell sx={{ py: 0.5, pr: 0, color: 'text.secondary' }}>
                {weatherSymbolNames[entry.wsymb2]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
