"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Guard from "@/guard";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import clsx from "clsx";
import { useState } from "react";
import ListDiscountPage from "../discount/page";
import ListWholesalePage from "../wholesale/page";

const tabValues = [
  {
    label: "Catalogue des promotions",
    value: "discountList",
    permission: PERMISSIONS.DISCOUNT.READ_ALL,
  },
  {
    label: "Catalogue des prix de gros",
    value: "wholesaleList",
    permission: PERMISSIONS.WHOLESALE.READ_ALL,
  },
];

export default function ListProductPage() {
  const [activeTab, setActiveTab] = useState<string>(tabValues[0].value);
  return (
    <div className="w-full h-full p-4">
      <Tabs
        defaultValue="Listes des promotions "
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="border-b items-end flex justify-between">
          <div className="hidden md:block">
            <TabsList
              className="bg-transparent border-b-0 flex gap-2"
              aria-label="Filter tabs"
            >
              {tabValues.map(({ value, label, permission }) => (
                <Guard key={value} permission={permission}>
                  <TabsTrigger
                    value={value}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none border-b-4",
                      activeTab === value
                        ? "text-primary border-accent"
                        : "text-gray-600 hover:text-primary hover:border-b-4 py-2 hover:border-gray-300"
                    )}
                  >
                    {label}
                  </TabsTrigger>
                </Guard>
              ))}
            </TabsList>
          </div>

          <div className="block md:hidden mb-4">
            <div className="flex flex-row items-center gap-2">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {tabValues.map(({ value, label, permission }) => (
                    <Guard key={value} permission={permission}>
                      <SelectItem value={value}>{label}</SelectItem>
                    </Guard>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col">
          <Guard permission={PERMISSIONS.MOVEMENT.READ_ALL}>
            {activeTab === tabValues[0].value ? <ListDiscountPage /> : <></>}
          </Guard>

          <Guard permission={PERMISSIONS.MOVEMENT.CREATE}>
            {activeTab === tabValues[1].value ? (
              <Guard permission={PERMISSIONS.PRODUCT.CREATE}>
                <ListWholesalePage />
              </Guard>
            ) : (
              <></>
            )}
          </Guard>
        </div>
      </Tabs>
    </div>
  );
}
