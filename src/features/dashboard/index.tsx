"use client";

import { getDashboardHistory, getStatInfo } from "@/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, LayoutGrid, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import ChartDashboard from "./chart";
import FiltersDashboard, { filter } from "./filtersDashboard";
import DashboardStatsSkeleton from "./statsSkeleton";

export default function StockDashboard() {
  const [filter, setFilter] = useState<filter>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get-stats-dashboard"],
    queryFn: () => getStatInfo({}),
  });

  const { data: history } = useQuery({
    queryKey: ["get-history-dashboard", filter],
    queryFn: () => getDashboardHistory({ ...filter }),
  });
  return (
    <div className="w-full space-y-8 max-h-[calc(100vh-10rem)] overflow-y-auto">
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
      <div className=" col-span-6 mt-8">
        <FiltersDashboard {...{ filter, setFilter }} />
      </div>

      {history?.data ? (
        <ChartDashboard
          data={history.data}
          title="Flux de stock"
          xAxisDataKey="date"
          dataKey={[
            { dataKey: "inbound", name: "Entrées", fill: "#16234a" },
            { dataKey: "outbound", name: "Sorties", fill: "#dc7626" },
          ]}
          className="col-span-4"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
