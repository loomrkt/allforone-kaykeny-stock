// import { Button } from "@/components/ui/button";
// import { Stock } from "@/interfaces/stock";
// import QRCode from "react-qr-code";
// import { generateProductPDF } from "./generateProductPDF";

// export default function ProductQRCode({ stock }: { stock: Stock }) {
//   // Encodage des données utiles en français
//   const encodedData = {
//     "Nom du produit": stock.productName,
//     "Quantité en stock": stock.quantity,
//     Couleur: stock.colorName,
//     Taille: stock.sizeName,
//     Dépôt: stock.depotName,
//     Prix: stock.price,
//     "Prix de transfert": stock.transferPrice,
//     "Prix promotionnel": stock.promotionalPrice ?? "N/A",
//   };

//   return (
//     <div className="w-full flex flex-col gap-2 items-center justify-center">
//       <div className="p-4 bg-white rounded shadow w-fit">
//         <QRCode value={JSON.stringify(encodedData)} size={140} />{" "}
//       </div>
//       <Button
//         onClick={() => generateProductPDF(encodedData)}
//         variant="outline"
//         className="w-fit"
//       >
//         Générer la fiche PDF
//       </Button>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Stock } from "@/interfaces/stock";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { generateProductPDF } from "./generateProductPDF";

export default function ProductQRCode({ stock }: { stock: Stock }) {
  const printRef = useRef<HTMLDivElement>(null);

  const encodedData = {
    "Nom du produit": stock.productName,
    "Quantité en stock": stock.quantity,
    Couleur: stock.colorName,
    Taille: stock.sizeName,
    Dépôt: stock.depotName,
    Prix: stock.price,
    "Prix de transfert": stock.transferPrice,
    "Prix promotionnel": stock.promotionalPrice ?? "N/A",
  };

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;

    const popup = window.open("", "_blank", "width=600,height=800");
    if (!popup) return;

    popup.document.write(`
      <html>
        <head>
          <title>Fiche produit</title>
          <style>
            @page {
              size: A6 portrait;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              margin: 0;
              font-size: 12px;
            }
            .container {
              width: 100%;
              box-sizing: border-box;
              padding: 10px;
            }
            .qr {
              text-align: left;
              margin-bottom: 12px;
            }
            .qr img {
              width: 120px;
              height: 120px;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            li {
              margin: 6px 0;
            }
            h2 {
              text-align: center;
              font-size: 16px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Fiche produit</h2>
            <div class="qr">
              ${printRef.current?.querySelector("svg")?.outerHTML || ""}
            </div>
            <ul>
              ${Object.entries(encodedData)
                .map(
                  ([key, value]) =>
                    `<li><strong>${key} :</strong> ${String(value)}</li>`
                )
                .join("")}
            </ul>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      {/* Zone visible */}
      <div>
        <div className="p-4 bg-white rounded shadow w-fit mx-auto">
          <div className="flex justify-center mb-4" ref={printRef}>
            <QRCode value={JSON.stringify(encodedData)} size={140} />
          </div>
          <ul className="text-sm">
            {Object.entries(encodedData).map(([key, value]) => (
              <li key={key}>
                <strong>{key} :</strong> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => generateProductPDF(encodedData)}
          variant="outline"
        >
          Télécharger en PDF
        </Button>

        <Button onClick={handlePrint} variant="default">
          Imprimer la fiche (A6)
        </Button>
      </div>
    </div>
  );
}
