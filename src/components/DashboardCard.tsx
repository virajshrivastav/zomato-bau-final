import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const DashboardCard = ({ title, children, className, footer }: DashboardCardProps) => {
  return (
    <Card
      className={cn(
        "shadow-md hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/95 hover:-translate-y-1 animate-fade-in backdrop-blur-sm",
        className
      )}
    >
      <CardHeader className="pb-3 sm:pb-4 border-b border-border/50">
        <CardTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight break-words">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-3 sm:pt-4">
        {children}
        {footer && (
          <div className="pt-3 sm:pt-4 border-t border-border/50 mt-3 sm:mt-4">{footer}</div>
        )}
      </CardContent>
    </Card>
  );
};
