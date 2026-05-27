import { z } from 'zod'

export const devSandboxConfigSchema = z.object({
  label: z.string().default('Hello'),
  volume: z.number().min(0).max(100).default(50).describe('slider'),
  accentColor: z.string().default('#1976d2').describe('color'),
  bio: z.string().default('').describe('multiline'),
  mode: z.enum(['minimal', 'detailed', 'debug']).default('minimal'),
  tags: z.array(z.enum(['alpha', 'beta', 'stable', 'deprecated'])).default([]),
  internalId: z.string().default('dev-001').describe('hidden'),
})

export type DevSandboxConfig = z.infer<typeof devSandboxConfigSchema>
