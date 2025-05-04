
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  className?: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  loading = false,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1 text-xs">
            <span
              className={cn(
                "mr-1",
                trend.isUpward ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isUpward ? "↑" : "↓"}
            </span>
            <span
              className={cn(
                trend.isUpward ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
