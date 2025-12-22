export function DisplayScannedData({ data }: { data: string }) {
  try {
    const parsed = JSON.parse(data); // On essaie de parser le texte scanné (QR)
    return (
      <ul className="text-sm space-y-1">
        {Object.entries(parsed).map(([key, value]) => (
          <li key={key}>
            <strong>{key} :</strong> {String(value)}
          </li>
        ))}
      </ul>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return <p className="text-red-500">Données invalides ou illisibles.</p>;
  }
}
