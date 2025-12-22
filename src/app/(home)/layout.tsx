/* eslint-disable @typescript-eslint/no-explicit-any */

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Drawer from "@/features/drawer";
import Navbar from "@/features/navbar";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Loading from "../loading";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-y-hidden">
      <Drawer />
      <Navbar />
      <div className="w-full pt-20 max-h-screen ">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}

export default DashboardLayout;
