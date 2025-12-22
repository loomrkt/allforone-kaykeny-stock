/* eslint-disable react/no-unescaped-entities */
"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const NotFoundPage = () => {
  const router = useRouter();
  const params = useParams();

  const handleGoHome = () => {
    router.push(`/${params?.locale}/home`);
  };

  return (
    <div className="h-screen bg-gradient-to-r from-red-400 via-yellow-500 to-orange-500 flex justify-center items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500 to-transparent opacity-30 blur-lg animate-pulse"></div>
        <div className="flex flex-col items-center space-y-4 z-50 text-white">
          <div className="text-4xl font-extrabold">Oups ! Page non trouvée</div>
          <div className="text-lg">
            L'URL que vous avez demandée n'existe pas.
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce200"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce400"></div>
          </div>
          <div className="text-sm mt-4">Retour à la page d'accueil</div>
          <Link
            href={`/${params?.locale}/home`}
            className="mt-2 text-blue-200 hover:text-blue-400"
          >
            Cliquez ici pour revenir
          </Link>
          <Button onClick={handleGoHome}>home</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
