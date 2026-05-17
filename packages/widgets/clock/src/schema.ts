import { z } from 'zod'

export const clockConfigSchema = z.object({
  locale: z.string().default('sv-SE'),
  hour12: z.boolean().default(false),
})

export type ClockConfig = z.infer<typeof clockConfigSchema>
