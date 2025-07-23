import React from "react";

export function formatTextToJSX(texte) {
  // Expressions régulières
  const regex = /((https?:\/\/[^\s]+)|(wa\.me\/\d+)|(\b0\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}\b)|(🇬🇦|🛑|‼️|☎|🛵|NB:))/gi;

  const parts = texte.split(regex).filter(Boolean);

  return parts.map((part, index) => {
    const trimmed = part.trim();

    // Liens web
    if (/^https?:\/\/[^\s]+$/.test(trimmed)) {
      return (
        <a key={index} href={trimmed} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {trimmed}
        </a>
      );
    }

    // Lien WhatsApp sans http
    if (/^wa\.me\/\d+$/.test(trimmed)) {
      return (
        <a key={index} href={`https://${trimmed}`} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
          {trimmed}
        </a>
      );
    }

    // Numéro de téléphone
    if (/^0\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/.test(trimmed)) {
      const cleanNumber = trimmed.replace(/[-\s]/g, "");
      return (
        <a key={index} href={`tel:${cleanNumber}`} className="text-red-500">
          📞 {trimmed}
        </a>
      );
    }

    // Ajout de retour à la ligne pour certains éléments
    if (["🇬🇦", "🛑", "‼️", "☎", "🛵", "NB:"].includes(trimmed)) {
      return (
        <React.Fragment key={index}>
          <br />
          <strong>{trimmed}</strong>{" "}
        </React.Fragment>
      );
    }

    // Par défaut : texte brut
    return <span key={index}>{part}</span>;
  });
}
