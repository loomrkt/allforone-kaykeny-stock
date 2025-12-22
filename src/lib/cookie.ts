"use server";

import { cookies } from "next/headers";

export const clearCookie = async (): Promise<void> => {
  const cookieStore = cookies();
  (await cookieStore).delete("token");
  (await cookieStore).delete("refresh");
};

export const getCookie = async (): Promise<{
  token?: string;
  refresh?: string;
}> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const refresh = (await cookieStore).get("refresh")?.value;
  return { token, refresh };
};
