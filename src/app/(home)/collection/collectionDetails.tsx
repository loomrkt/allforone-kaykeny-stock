import Collection from "@/interfaces/collection";
import Image from "next/image";

type Props = {
  collection: Collection;
};

export default function CollectionDetail({ collection }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{collection.name}</h2>
      <p className="text-sm text-gray-600">
        Déscription : {collection.description}
      </p>
      <p className="text-sm text-gray-600">Code : {collection.code}</p>

      <div className="relative w-full h-64 rounded-md overflow-hidden">
        <Image
          src={collection?.imageUrl || "/assets/image/kk.webp"}
          alt={collection?.imageName || "Image de la collection"}
          className="object-cover"
          width={1000}
          height={1000}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          unoptimized={true}
          loading="lazy"
          quality={75}
          placeholder="blur"
          blurDataURL={collection?.imageUrl || "/assets/image/kk.webp"}
          style={{ objectFit: "cover" }}
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = "/assets/image/kk.webp";
          }}
        />
      </div>
    </div>
  );
}
