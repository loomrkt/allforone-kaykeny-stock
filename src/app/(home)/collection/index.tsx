"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateUpdateCollectionForm from "@/features/collection/addCollectionForm";
import Collection from "@/interfaces/collection";
import { useState } from "react";
import GridCollection from "./grid";

interface ListCollectionPageProps {
  search?: string;
}

function ListCollectionPage({ search }: ListCollectionPageProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setSelectedCollection(null);
  };

  return (
    <div className="w-full h-auto">
      <GridCollection
        search={search}
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        setSelectedCollection={setSelectedCollection}
        selectedCollection={selectedCollection}
      />

      <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
        <DialogContent className="max-w-md w-full">
          <CreateUpdateCollectionForm
            collection={selectedCollection || undefined}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ListCollectionPage;
