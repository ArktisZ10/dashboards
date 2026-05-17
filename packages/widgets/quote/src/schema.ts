import { z } from 'zod'

export const quoteConfigSchema = z.object({
  apiKey: z.string().default(''),
  category: z.string().default('inspirational'),
})

export type QuoteConfig = z.infer<typeof quoteConfigSchema>
