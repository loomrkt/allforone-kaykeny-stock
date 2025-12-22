"use client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AddSize() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    console.log("params :>> ", params);
  }, [params]);

  return (
    <>
      <Button onClick={() => router.push(`/size/create`)}>
        Ajouter une taille
      </Button>
    </>
  );
}
