import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import type { WidgetProps } from '@dashboard/sdk'
import { quoteConfigSchema } from './schema'

interface QuoteData {
  quote: string
  author: string
  category: string
}

function getTodayKey(category: string) {
  return `dashboard-quote-${category}-${new Date().toISOString().slice(0, 10)}`
}

async function fetchQuote(apiKey: string, category: string): Promise<QuoteData> {
  const cacheKey = getTodayKey(category)
  const cached = localStorage.getItem(cacheKey)
  if (cached) return JSON.parse(cached) as QuoteData

  if (!apiKey) throw new Error('API key required — configure this widget')

  const res = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${encodeURIComponent(category)}`, {
    headers: { 'X-Api-Key': apiKey },
  })
  if (!res.ok) throw new Error(`api-ninjas error: ${res.status}`)
  const data = await res.json() as QuoteData[]
  if (!data.length) throw new Error('No quote returned')

  localStorage.setItem(cacheKey, JSON.stringify(data[0]))
  return data[0]
}

export function QuoteWidget({ config }: WidgetProps) {
  const parsed = quoteConfigSchema.safeParse(config)
  const { apiKey, category } = parsed.success ? parsed.data : { apiKey: '', category: 'inspirational' }

  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchQuote(apiKey, category)
      .then((q) => {
        if (!cancelled) {
          setQuote(q)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to fetch quote')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [apiKey, category])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error) return <Alert severity="warning" sx={{ m: 1 }}>{error}</Alert>
  if (!quote) return null

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        p: 2,
        gap: 1,
      }}
    >
      <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 32, opacity: 0.7 }} />
      <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
        {quote.quote}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'flex-end' }}>
        — {quote.author}
      </Typography>
    </Box>
  )
}
