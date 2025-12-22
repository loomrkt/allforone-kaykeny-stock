import { jsPDF } from "jspdf";

export function generateProductPDF(stock: {
  [key: string]: string | number | null;
}) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Fiche produit scannée", 20, 20);

  doc.setFontSize(12);
  let y = 40;

  Object.entries(stock).forEach(([key, value]) => {
    doc.text(`${key} : ${String(value)}`, 20, y);
    y += 10;
  });

  doc.save(`Fiche-${stock["Nom du produit"] || "produit"}.pdf`);
}
