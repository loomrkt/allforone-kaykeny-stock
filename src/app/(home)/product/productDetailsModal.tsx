"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@/interfaces/category";
import Collection from "@/interfaces/collection";
import { Media } from "@/interfaces/common";
import { Product } from "@/interfaces/product";
import { formatCategoryOption, formatCollectionOption } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductCardDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  collections: Collection[];
}

export function ProductCardDetails({
  product,
  isOpen,
  onClose,
  categories,
  collections,
}: ProductCardDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images: Media[] = product.images ? [...product.images] : [];
  const hasImages = images.length > 0;

  const formattedCategories = formatCategoryOption(categories);
  const formattedCollections = formatCollectionOption(collections);

  const categoryName =
    formattedCategories.find((cat) => cat.value === product.categoryId)
      ?.label || product.categoryId;
  const collectionName =
    formattedCollections.find((col) => col.value === product.collectionId)
      ?.label || product.collectionId;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  console.log(
    "`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[currentImageIndex]?.url}` :>> ",
    `${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[currentImageIndex]?.url}`
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full max-h-[95vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            <Badge variant={"outline"}>{product.name}</Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Détails du produit
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          {hasImages && (
            <div className="relative">
              <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden  flex items-center justify-center">
                <Image
                  src={
                    images[currentImageIndex]?.url
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[currentImageIndex]?.url}`
                      : "/assets/image/kk.webp"
                  }
                  alt={images[currentImageIndex]?.name || "Product Image"}
                  width={2000}
                  height={2000}
                  className="object-contain h-full w-fit border border-border rounded-lg"
                />
              </div>
              {images.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevImage}
                      className="m-2 bg-background/80 hover:bg-background"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextImage}
                      className="m-2 bg-background/80 hover:bg-background"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          currentImageIndex === index
                            ? "bg-primary"
                            : "bg-muted hover:bg-muted-foreground"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Référence :
              </span>
              <span>{product.reference}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Sexe :
              </span>
              <span>
                {product.gender === "M"
                  ? "Homme"
                  : product.gender === "F"
                  ? "Femme"
                  : "Unisexe"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Prix :
              </span>
              <span className="font-medium text-primary">
                {product.price} Ar
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Coupe :
              </span>
              <span>{product.coupe}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Catégorie :
              </span>
              <span>{categoryName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Collection :
              </span>
              <span>{collectionName}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
