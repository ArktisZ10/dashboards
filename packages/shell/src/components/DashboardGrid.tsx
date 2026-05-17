import { useCallback } from 'react'
import { useAtom } from 'jotai'
import ReactGridLayout from 'react-grid-layout'
import type { Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { dashboardAtom, layoutAtom } from '../store'
import { WidgetFrame } from './WidgetFrame'

const COLS = 12
const ROW_HEIGHT = 80

interface DashboardGridProps {
  width: number
}

export function DashboardGrid({ width }: DashboardGridProps) {
  const [dashboard, setDashboard] = useAtom(dashboardAtom)
  const [layout] = useAtom(layoutAtom)

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      setDashboard((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) => {
          const l = newLayout.find((nl) => nl.i === w.instanceId)
          if (!l) return w
          return { ...w, layout: { x: l.x, y: l.y, w: l.w, h: l.h } }
        }),
      }))
    },
    [setDashboard]
  )

  return (
    <ReactGridLayout
      layout={layout}
      cols={COLS}
      rowHeight={ROW_HEIGHT}
      width={width}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".drag-handle"
      resizeHandles={['se']}
    >
      {dashboard.widgets.map((w) => (
        <div key={w.instanceId}>
          <WidgetFrame instance={w} />
        </div>
      ))}
    </ReactGridLayout>
  )
}
