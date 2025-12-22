import { useEffect, useState } from "react";

type AutoHideAfter1HourProps = {
  date: string | Date;
  children: React.ReactNode;
};

export default function AutoHideAfter1Hour({
  date,
  children,
}: AutoHideAfter1HourProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const inputDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - inputDate.getTime();
    const diffInHours = diffMs / (1000 * 60 * 60);

    // if expired
    if (diffInHours >= 1) {
      setVisible(false);
      return;
    }

    // Otherwise, calculate the remaining timeout before expiration
    const timeoutMs = 60 * 60 * 1000 - diffMs;

    const timeout = setTimeout(() => {
      setVisible(false);
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [date]);

  if (!visible) return null;

  return <>{children}</>;
}
