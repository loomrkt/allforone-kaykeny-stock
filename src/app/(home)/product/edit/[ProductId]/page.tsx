"use client";

import { getProduct } from "@/api/product";
import Loading from "@/app/loading";
import { UpdateProductForm } from "@/features/product/updateProductForm";
import { Product } from "@/interfaces/product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.productId !== "new") {
        const fetchedProduct = await getProduct(params.productId as string);
        if (fetchedProduct !== null) {
          setProduct(fetchedProduct);
        }
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [params.productId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-8 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {product ? <UpdateProductForm product={product} /> : <></>}
      </div>
    </div>
  );
}
