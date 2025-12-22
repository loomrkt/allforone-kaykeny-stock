import React, { Suspense } from "react";
import Loading from "../loading";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen max-sm: min-h-screen flex justify-center items-center">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}

export default Layout;
