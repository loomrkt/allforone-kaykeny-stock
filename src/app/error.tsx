"use client";

import Section from "@/components/container/section";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GlobalErrorPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(`/dashboard`);
  };

  return (
    <Section className="w-screen h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center text-white text-center max-w-md p-6 rounded shadow-lg bg-primary">
        <Image
          src="/assets/image/kk.webp"
          alt="Kay Keny"
          height={120}
          width={120}
          className="object-cover mb-4 rounded-full border border-white bg-white"
        />

        <ShieldAlert size={48} strokeWidth={3} className="text-red-500 mb-4" />

        <h3 className="text-3xl font-semibold mb-2">Erreur système</h3>
        <p className="mb-4 text-gray-300">
          Une erreur est survenue lors de la gestion du stock. Veuillez
          réessayer ou contacter un administrateur.
        </p>

        <Button
          className="rounded bg-white text-black hover:bg-gray-200"
          onClick={handleGoHome}
        >
          <ChevronLeft size={20} className="mr-2" /> Retour au tableau de bord
        </Button>
      </div>
    </Section>
  );
};

export default GlobalErrorPage;
