"use client";

import SearchInput from "@/components/common/searchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import ListCategoryPage from "../category";
import ListCollectionPage from "../collection";
import ListColorPage from "../color";
import ListSizePage from "../size";

const tabValues = [
  { label: "Tailles", value: "size" },
  { label: "Modeles", value: "collections" },
  { label: "Catégories", value: "category" },
  { label: "Couleurs", value: "color" },
];

export default function ClassificationPage() {
  const [activeTab, setActiveTab] = useState<string>(tabValues[0].value);
  const [searchParams, setSearchParams] = useState<string>("");
  const debouncedSearch = useDebounce<string>(searchParams, 1000);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchParams("");
  };

  return (
    <div className="w-full h-auto p-4 overflow-y-scroll">
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <div className="border-b flex items-end justify-between">
          <div className="hidden md:block">
            <TabsList
              className="bg-transparent border-b-0 flex gap-2"
              aria-label="Filter tabs"
            >
              {tabValues.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-none",
                    activeTab === value
                      ? "text-primary border-b-4 border-accent"
                      : "text-gray-600 hover:text-primary hover:border-b-4 hover:border-gray-300"
                  )}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="block md:hidden mb-4 w-full">
            <div className="flex flex-row items-center gap-2 w-full">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {tabValues.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <SearchInput
                placeholder={`Recherce ${activeTab}...`}
                value={searchParams}
                onChange={handleSearch}
                onClear={handleClearSearch}
              />
            </div>
          </div>

          <div className="hidden md:flex justify-end w-64">
            <SearchInput
              placeholder={`Recherce ${activeTab}...`}
              value={searchParams}
              onChange={handleSearch}
              onClear={handleClearSearch}
            />
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "size" && <ListSizePage search={debouncedSearch} />}
          {activeTab === "collections" && (
            <ListCollectionPage search={debouncedSearch} />
          )}
          {activeTab === "category" && (
            <ListCategoryPage search={debouncedSearch} />
          )}
          {activeTab === "color" && <ListColorPage search={debouncedSearch} />}
        </div>
      </Tabs>
    </div>
  );
}
