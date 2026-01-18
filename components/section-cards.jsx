import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      {/* OPD Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total OPD Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹1,25,000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue increased this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            OPD billing for last 6 months
          </div>
        </CardFooter>
      </Card>

      {/* OPD Patients */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>OPD Patients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Fewer OPD visits this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Patient footfall needs attention
          </div>
        </CardFooter>
      </Card>

      {/* Active OPD Cases */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active OPD Cases</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            456
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Stable patient flow <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Doctors actively consulting patients
          </div>
        </CardFooter>
      </Card>

      {/* Pending Payments */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending OPD Payments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹30,000
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pending amount slightly increased <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Bills awaiting patient payment
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
