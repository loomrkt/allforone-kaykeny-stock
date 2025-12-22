"use client";

import { getLowStock } from "@/api/stock";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { BellIcon, Box } from "lucide-react";
import Image from "next/image";

function NotificationContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-low-stock"],
    queryFn: getLowStock,
  });

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500">Chargement des notifications...</p>
    );
  }

  if (!data?.data?.length) {
    return (
      <p className="text-sm text-gray-500">
        Aucun article en rupture ou sous le seuil critique.
      </p>
    );
  }

  return (
    <ul className="space-y-2 max-h-[80vh] overflow-auto">
      {data.data.map((notif) => (
        <li
          key={notif.stockId}
          className="flex items-center gap-3 p-3 rounded-md hover:bg-orange-50 border border-transparent hover:border-orange-200 transition cursor-pointer"
        >
          {notif?.imageUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${notif.imageUrl}`}
              alt={notif?.imageName ?? ""}
              width={100}
              height={100}
              className="w-10 h-10 rounded object-cover border"
            />
          ) : (
            <Box
              strokeWidth={1}
              className="w-10 h-10 border text-primary/50 bg-primary/10 rounded"
            />
          )}

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {notif.stockName}
            </span>
            <span className="text-xs text-red-600">
              Stock critique : {notif.quantity} unité
              {notif.quantity > 1 ? "s" : ""}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:text-white border"
        >
          <BellIcon size={20} />
          {true ? (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {/* {lowStockNotifications.length} */}
            </span>
          ) : (
            <></>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 shadow-xl border border-gray-200 rounded-xl">
        <h4 className="font-semibold text-base text-gray-800 mb-3">
          Alertes de stock vêtements
        </h4>

        <NotificationContent />
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;
