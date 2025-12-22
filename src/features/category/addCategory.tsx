"use client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AddCategory() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    console.log("params :>> ", params);
  }, [params]);

  return (
    <>
      <Button onClick={() => router.push(`/category/create`)}>
        Ajouter une categorie
      </Button>
    </>
  );
}
