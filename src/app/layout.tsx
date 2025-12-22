"use client ";
import ThemeWrapper from "@/components/themeWrapper";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import AuthProvider from "@/providers/authProvider";
import QueryProvider from "@/providers/queryProvider";
import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import { PropsWithChildren, Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

const fustat = Fustat({
  subsets: ["latin"],
  variable: "--font-fustat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KayKeny Stock management",
  description: "KayKeny Stock management",
};

export default async function RootLayout(props: PropsWithChildren) {
  return (
    <html style={{ scrollBehavior: "smooth" }}>
      <body className={cn(fustat.variable, "antialiased overflow-x-hidden")}>
        <QueryProvider>
          <AuthProvider>
            <ThemeWrapper>
              <Suspense fallback={<Loading />}>
                <main className="bg-white h-screen flex flex-col">
                  <div className="flex-1  overflow-y-hidden">
                    {props.children}
                  </div>
                  <Toaster />
                </main>
              </Suspense>
            </ThemeWrapper>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
