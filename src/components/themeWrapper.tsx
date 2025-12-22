"use client";

import { ThemeProvider } from "@/components/themeProvider";
import { useEffect, useState } from "react";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      themes={["light", "dark"]}
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
