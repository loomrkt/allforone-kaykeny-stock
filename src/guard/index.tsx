"use client";

import { PERMISSIONS } from "@/interfaces/role&permission/constant";
import { useAuthStore } from "@/stores/auth";
import { jwtDecode } from "jwt-decode";
import React from "react";

interface GuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

type DecodedToken = {
  permissions?: string[];
  role?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function hasPermission(
  token: string | undefined,
  permission: string
): boolean {
  if (!token) return false;

  if (permission === PERMISSIONS.ALL) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.role === "SUPER_ADMIN") return true;
    return decoded.permissions?.includes(permission) ?? false;
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return false;
  }
}

function Guard({ permission, fallback, children }: GuardProps) {
  const token = useAuthStore((state) => state.user?.token);

  let hasPermissionValue = hasPermission(token, permission);

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      hasPermissionValue = decoded.permissions?.includes(permission) ?? false;
    } catch (error) {
      console.error("Erreur de décodage du token JWT :", error);
    }
  }

  if (hasPermissionValue) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}

export default Guard;
