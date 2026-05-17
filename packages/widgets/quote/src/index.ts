import type { WidgetModule } from '@dashboard/sdk'
import { QuoteWidget } from './QuoteWidget'
import { quoteConfigSchema } from './schema'

const quoteModule: WidgetModule = {
  meta: {
    id: '@dashboard/widget-quote',
    name: 'Quote of the Day',
    description: 'Inspirational quote fetched from api-ninjas (refreshes daily)',
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 2, h: 2 },
  },
  component: QuoteWidget,
  configSchema: quoteConfigSchema,
}

export default quoteModule
