"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import * as React from "react";

export type price = { minPrice?: number; maxPrice?: number };
export type priceFilterProps = {
  setPrice: (price: price) => void;
};
export default function PriceFilter({ setPrice }: priceFilterProps) {
  const [range, setRange] = React.useState<[number, number]>([20000, 300000]);

  const handleMinInputChange = (value: string) => {
    const min = parseInt(value) || 0;
    const newRange: [number, number] = [Math.min(min, range[1]), range[1]];
    setRange(newRange);
  };

  const handleMaxInputChange = (value: string) => {
    const max = parseInt(value) || 0;
    const newRange: [number, number] = [range[0], Math.max(max, range[0])];
    setRange(newRange);
  };

  React.useEffect(() => {
    setPrice({ minPrice: range[0], maxPrice: range[1] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <h2 className=" font-medium text-gray-700 underline">Prix</h2>

      <Slider
        value={range}
        min={20000}
        max={300000}
        step={1000}
        onValueChange={(val: [number, number]) => setRange(val)}
        className="w-full"
      />

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={range[0]}
          onChange={(e) => handleMinInputChange(e.target.value)}
          placeholder="Min"
          className="w-1/2"
        />
        <span>à</span>
        <Input
          type="number"
          value={range[1]}
          onChange={(e) => handleMaxInputChange(e.target.value)}
          placeholder="Max"
          className="w-1/2"
        />
      </div>
    </div>
  );
}
