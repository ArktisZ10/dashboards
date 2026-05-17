import type { WidgetModule } from '@dashboard/sdk'
import { ClockWidget } from './ClockWidget'
import { clockConfigSchema } from './schema'

const clockModule: WidgetModule = {
  meta: {
    id: '@dashboard/widget-clock',
    name: 'Clock',
    description: 'Displays current date and time',
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 2, h: 2 },
  },
  component: ClockWidget,
  configSchema: clockConfigSchema,
}

export default clockModule
