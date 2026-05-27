import type { WidgetModule } from '@dashboard/sdk'
import { DevSandboxWidget } from './DevSandboxWidget'
import { devSandboxConfigSchema } from './schema'

const devSandboxModule: WidgetModule = {
  meta: {
    id: '@dashboard/widget-dev-sandbox',
    name: '[DEV] Sandbox',
    description: 'Exercises all config form field types. Dev builds only.',
    defaultSize: { w: 3, h: 3 },
    minSize: { w: 2, h: 2 },
  },
  component: DevSandboxWidget,
  configSchema: devSandboxConfigSchema,
}

export default devSandboxModule
