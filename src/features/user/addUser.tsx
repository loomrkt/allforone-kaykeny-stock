"use client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AddDEpot() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    console.log("params :>> ", params);
  }, [params]);

  return (
    <>
      <Button onClick={() => router.push(`/user/create`)}>
        Ajouter un utilisateur
      </Button>
    </>
  );
}
