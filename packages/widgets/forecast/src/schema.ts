import { z } from 'zod'

export const forecastConfigSchema = z.object({
  latitude: z.number().min(-90).max(90).default(57.7),
  longitude: z.number().min(-180).max(180).default(11.97),
  locationName: z.string().default('Göteborg'),
})

export type ForecastConfig = z.infer<typeof forecastConfigSchema>
