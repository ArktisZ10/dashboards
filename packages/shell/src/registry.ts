import type { WidgetModule } from '@dashboard/sdk'
import clockModule from '@dashboard/widget-clock'
import forecastModule from '@dashboard/widget-forecast'
import quoteModule from '@dashboard/widget-quote'

const registry = new Map<string, WidgetModule>([
  [clockModule.meta.id, clockModule],
  [forecastModule.meta.id, forecastModule],
  [quoteModule.meta.id, quoteModule],
])

export function getWidget(widgetType: string): WidgetModule | undefined {
  return registry.get(widgetType)
}

export function getAllWidgets(): WidgetModule[] {
  return Array.from(registry.values())
}
