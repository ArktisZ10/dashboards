import type { WidgetModule } from '@dashboard/sdk'
import { ForecastWidget } from './ForecastWidget'
import { forecastConfigSchema } from './schema'

const forecastModule: WidgetModule = {
  meta: {
    id: '@dashboard/widget-forecast',
    name: 'Weather Forecast',
    description: 'Shows weather forecast using SMHI open data (Sweden)',
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
  },
  component: ForecastWidget,
  configSchema: forecastConfigSchema,
}

export default forecastModule
