import { useEffect, useState } from "react"
import axios from "axios"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface CryptoChartProps {
  symbol: string
  name: string
}

export function CryptoChart({ symbol, name }: CryptoChartProps) {
  const [price, setPrice] = useState<number>(0)
  const [volume, setVolume] = useState({ buy: 0, sell: 0 })
  const [change24h, setChange24h] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
          {
            headers: {
              "X-CMC_PRO_API_KEY": "2deaa67e-178b-4056-b50d-531f42717fc9",
            },
          }
        )
        const data = response.data.data[symbol]
        setPrice(data.quote.USD.price)
        setChange24h(data.quote.USD.percent_change_24h)
        // Simulated volume data as CMC API doesn't provide buy/sell ratio
        setVolume({
          buy: data.quote.USD.volume_24h * 0.6,
          sell: data.quote.USD.volume_24h * 0.4,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [symbol])

  const chartData = [{ buy: volume.buy, sell: volume.sell }]

  const chartConfig = {
    buy: {
      label: "Buy Volume",
      color: "hsl(var(--success))",
    },
    sell: {
      label: "Sell Volume",
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig

  const totalVolume = volume.buy + volume.sell

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-2xl font-bold">
          ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={60}
            outerRadius={100}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 12}
                          className="fill-foreground text-lg font-bold"
                        >
                          {(volume.buy / totalVolume * 100).toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="fill-muted-foreground text-xs"
                        >
                          Buy Ratio
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="buy"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-buy)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="sell"
              fill="var(--color-sell)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {change24h >= 0 ? (
            <>
              Trending up by {change24h.toFixed(2)}% <TrendingUp className="h-4 w-4 text-success" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(change24h).toFixed(2)}% <TrendingDown className="h-4 w-4 text-destructive" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          24h Volume: ${totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </CardFooter>
    </Card>
  )
}