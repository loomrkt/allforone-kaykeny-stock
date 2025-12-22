import Image from "next/image";
import SyncLoader from "react-spinners/SyncLoader";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-gray-700">
      <Image
        src="/assets/image/kk.webp"
        alt="Kay Keny"
        height={200}
        width={200}
        className="object-cover mb-4"
      />

      <SyncLoader />
      <p className="mt-4 text-sm text-muted-foreground">
        Chargement des données de stock...
      </p>
    </div>
  );
}
