
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
    <div className={cn("glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 group", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <div className="text-primary">{icon}</div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
            {loading ? (
              <div className="h-8 w-24 bg-white/10 animate-pulse rounded mt-1" />
            ) : (
              <div className="text-3xl font-bold text-foreground mt-1">{value}</div>
            )}
          </div>
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}
      
      {trend && (
        <div className="flex items-center text-xs">
          <span
            className={cn(
              "mr-1 p-1 rounded-full",
              trend.isUpward ? "text-green-400 bg-green-400/20" : "text-red-400 bg-red-400/20"
            )}
          >
            {trend.isUpward ? "↗" : "↘"}
          </span>
          <span
            className={cn(
              "font-medium",
              trend.isUpward ? "text-green-400" : "text-red-400"
            )}
          >
            {trend.value}%
          </span>
          <span className="ml-1 text-muted-foreground">from last period</span>
        </div>
      )}
      
      {/* Decorative gradient line */}
      <div className="mt-4 h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-transparent rounded-full" />
    </div>
  );
};

export default MetricCard;
