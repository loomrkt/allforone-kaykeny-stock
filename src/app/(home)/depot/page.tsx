"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddDepotButton } from "@/features/depot/addDepotButton";
import clsx from "clsx";
import { useState } from "react";
import ListDepotPage from ".";

export default function ListDepositPage() {
  const [activeTab, setActiveTab] = useState("Informations sur chaque depot");

  const tabValues = ["Informations sur chaque depot"];

  return (
    <div className="w-full h-full p-4 ">
      <Tabs
        defaultValue="Informations sur chaque depot"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="border-b items-end flex  justify-between">
          <div className="hidden md:block">
            <TabsList
              className="bg-transparent border-b-0 flex gap-2"
              aria-label="Filter tabs"
            >
              {tabValues.map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none",
                    activeTab === value
                      ? "text-primary border-b-4  border-accent"
                      : "text-gray-600 hover:text-primary hover:border-b-4 py-2 hover:border-gray-300"
                  )}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </TabsTrigger>
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
                  {tabValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 relative">
                <Input
                  placeholder={`Search ${activeTab}...`}
                  className="pr-8 w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden items-center mb-2 md:flex gap-2 justify-end">
            <AddDepotButton />
            <div className="relative w-64 ">
              <Input placeholder={`Search ${activeTab}...`} className="pr-8" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex">
          <TabsContent value="Informations sur chaque depot" className="mt-0">
            <ListDepotPage />
          </TabsContent>
          {/* <TabsContent value="supplier" className="mt-0">
            <ListSupplierPage />
          </TabsContent> */}
        </div>
      </Tabs>
    </div>
  );
}
