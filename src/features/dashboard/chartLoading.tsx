import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ChartLoading({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-40 h-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simule le graphique */}
        <Skeleton className="w-full h-[300px] rounded-md" />
      </CardContent>
    </Card>
  );
}
