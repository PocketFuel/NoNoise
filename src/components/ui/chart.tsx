import { createContext, useContext } from "react"
import { TooltipProps, Tooltip } from "recharts"

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

const ChartContext = createContext<ChartConfig | null>(null)

interface ChartContainerProps {
  children: React.ReactNode
  config: ChartConfig
  className?: string
}

export function ChartContainer({
  children,
  config,
  className,
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={className}
        style={
          {
            "--color-buy": config.buy?.color,
            "--color-sell": config.sell?.color,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipContentProps extends TooltipProps<any, any> {
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  hideLabel = false,
}: ChartTooltipContentProps) {
  const config = useContext(ChartContext)

  if (!active || !payload?.length || !config) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {payload.map((item: any, index: number) => {
        const key = item.dataKey as keyof typeof config
        const data = config[key]

        return (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-1 w-1 rounded-full"
              style={{ background: data.color }}
            />
            {!hideLabel && <span className="text-xs text-muted-foreground">{data.label}:</span>}
            <span className="text-xs font-medium">{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export const ChartTooltip = Tooltip