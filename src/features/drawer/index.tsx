"use client";

import { Button } from "@/components/ui/button";
import Guard from "@/guard";
import usePersistStore from "@/hooks/usePersistStore";
import useSetStore from "@/hooks/useSetStore";
import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Layers,
  LayoutDashboard,
  LogOut,
  Repeat2,
  ShieldCheck,
  Tag,
  Tags,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const PATH = {
  user: "user",
  dashboard: "dashboard",
  product: "product",
  classification: "classification",
  depot: "depot",
  supplier: "supplier",
  stock: "stock",
  permission: "permission",
  wholesale: "wholesale",
  discount: "discount",
  stockMovement: "movement",
  discountWholesale: "discount-wholesale",
};

const links = [
  {
    label: "Tableau de bord",
    path: PATH.dashboard,
    Icon: LayoutDashboard,
    permission: PERMISSIONS.ALL,
  },
  {
    label: "Utilisateurs",
    path: PATH.user,
    Icon: Users,
    permission: PERMISSIONS.USER.READ_ALL,
  },
  {
    label: "Produits",
    path: PATH.product,
    Icon: Boxes,
    permission: PERMISSIONS.PRODUCT.READ_ALL,
  },
  {
    label: "Catégories & types",
    path: PATH.classification,
    Icon: Tags,
    permission: PERMISSIONS.ALL,
  },
  {
    label: "Dépôts",
    path: PATH.depot,
    Icon: Warehouse,
    permission: PERMISSIONS.DEPOT.READ_ALL,
  },
  {
    label: "Fournisseurs",
    path: PATH.supplier,
    Icon: Truck,
    permission: PERMISSIONS.DEPOT.READ_ALL,
  },
  {
    label: "Tarification",
    path: PATH.discountWholesale,
    Icon: Tag,
    permission: PERMISSIONS.DISCOUNT.READ_ALL,
  },
  {
    label: "Stocks",
    path: PATH.stock,
    Icon: Layers,
    permission: PERMISSIONS.STOCK.READ_ALL,
  },
  {
    label: "Rôles & permissions",
    path: PATH.permission,
    Icon: ShieldCheck,
    permission: PERMISSIONS.ROLE.READ_ALL,
  },
  {
    label: "Mouvements de stock",
    path: PATH.stockMovement,
    Icon: Repeat2,
    permission: PERMISSIONS.MOVEMENT.READ_ALL,
  },
];

function Drawer() {
  const pathname = usePathname();
  useSetStore();

  const authStore = usePersistStore(
    useAuthStore,
    useShallow((state) => state)
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = async () => {
    authStore?.deleteContext();
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav
      className={cn(
        "relative flex flex-col h-screen transition-all  duration-300 shadow-lg z-50",
        isCollapsed
          ? "w-[60px] bg-black text-white"
          : "w-[220px] bg-black text-white"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "absolute top-1/2 -right-3 z-50 w-6 h-6 p-0 border rounded-full shadow-md bg-white text-black hover:bg-orange-500 hover:text-white transition-all duration-300"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </Button>

      <div className="space-y-6 flex-1 py-6">
        <div
          className={cn(
            "flex items-center justify-center max-sm:p-1",
            isCollapsed ? "p-1" : "p-6"
          )}
        >
          <div className={cn("bg-white rounded-lg  space-y-2 w-full")}>
            <Image
              src="/assets/image/kk.webp"
              width={1000}
              height={1000}
              alt="Kaykeny Stock logo"
              className="transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1 mt-8">
          {links.map(({ label, path, Icon, permission }, index) => (
            <Guard permission={permission} key={index}>
              <div key={index} className="w-full">
                <Link
                  href={`/${path}`}
                  className={cn(
                    "flex items-center w-full p-3 gap-3 transition-colors hover:bg-neutral-600 opacity-80",
                    isCollapsed && "justify-center",
                    pathname.includes(path) &&
                      (isCollapsed
                        ? "bg-neutral-700 opacity-100"
                        : "bg-neutral-700 opacity-100 font-semibold border-l-2 border-white hover:bg-neutral-700"),
                    !isCollapsed && "text-sm"
                  )}
                >
                  <span>
                    <Icon
                      size={!isCollapsed ? 18 : 24}
                      strokeWidth={!isCollapsed ? 2 : 1}
                    />
                  </span>
                  {!isCollapsed && <span className="text-white">{label}</span>}
                </Link>
              </div>
            </Guard>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-700">
        <Button
          variant="outline"
          className={cn(
            "w-full rounded-md flex items-center justify-center gap-2 transition-colors",
            isCollapsed
              ? "bg-transparent border-white text-white hover:bg-white hover:text-black"
              : "bg-transparent border-white text-white hover:bg-white hover:text-black"
          )}
          onClick={logOut}
        >
          <LogOut
            size={18}
            className={cn(isCollapsed ? "text-white" : "text-white")}
          />
          {!isCollapsed && <span>Se déconnecter</span>}
        </Button>
      </div>
    </nav>
  );
}

export default Drawer;
