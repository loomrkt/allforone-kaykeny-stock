/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import LoginForm from "@/features/auth/loginForm";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./loading";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen  bg-gray-50 flex items-center justify-center ">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Image
            src="/assets/image/kk.webp"
            alt="Logo"
            height={200}
            width={200}
            className="object-cover"
          />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
