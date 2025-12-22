"use client";

import { getDashboardHistory, getStatInfo } from "@/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartDashboard from "@/features/dashboard/chart";
import ChartLoading from "@/features/dashboard/chartLoading";
import FiltersDashboard, {
  filter,
} from "@/features/dashboard/filtersDashboard";
import DashboardStatsSkeleton from "@/features/dashboard/statsSkeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, LayoutGrid, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function StockDashboardPage() {
  const [filter, setFilter] = useState<filter>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-stats-dashboard", filter.depotId],
    queryFn: () => getStatInfo({ depotId: filter.depotId }),
  });

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery({
    queryKey: ["get-history-dashboard", filter],
    queryFn: () => getDashboardHistory({ ...filter }),
  });
  return (
    <div className="w-full h-[calc(100vh-5rem)] max-sm:p-4 md:flex flex-col items-center justify-center container mx-auto space-y-8 max-h-[calc(100vh-10rem)] overflow-y-auto">
      {isLoading || isError ? <DashboardStatsSkeleton /> : <></>}
      {data ? (
        <div className=" w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produits enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quantité en stock
              </CardTitle>
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalStock}</div>
              <p className="text-xs text-muted-foreground">
                Unités disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valeur du stock
              </CardTitle>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stockValue.toLocaleString("fr-FR")} Ar
              </div>
              <p className="text-xs text-muted-foreground">
                Estimation globale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Produits en rupture
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">
                À réapprovisionner
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <></>
      )}

      {/* Chart */}
      <div className="col-span-4 space-y-8 mt-8 w-full p-0">
        <FiltersDashboard {...{ filter, setFilter }} />
        {isHistoryError || isHistoryLoading ? <ChartLoading /> : <></>}
        {history?.data ? (
          <ChartDashboard
            data={history.data}
            title="Flux de stock"
            xAxisDataKey="date"
            dataKey={[
              { dataKey: "inbound", name: "Entrées", fill: "#16234a" },
              { dataKey: "outbound", name: "Sorties", fill: "#dc7626" },
            ]}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
