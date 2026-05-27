import type React from 'react'
import type { ZodSchema } from 'zod'

export interface WidgetMeta {
  id: string
  name: string
  description: string
  defaultSize: { w: number; h: number }
  minSize?: { w: number; h: number }
}

export interface HostContext {
  theme: { mode: 'light' | 'dark' }
}

export interface WidgetProps {
  instanceId: string
  config: Record<string, unknown>
  hostContext: HostContext
}

export interface ConfigPanelProps {
  config: Record<string, unknown>
  onChange: (config: Record<string, unknown>) => void
  validationErrors: Record<string, string[]>
}

export interface WidgetModule {
  meta: WidgetMeta
  component: React.ComponentType<WidgetProps>
  configSchema?: ZodSchema
  ConfigPanel?: React.ComponentType<ConfigPanelProps>
}
