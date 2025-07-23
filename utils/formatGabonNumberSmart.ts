export default function formatGabonNumberSmart(
  input: string | undefined
): string {
  console.log("Entrée brute :", input);

  if (!input) {
    alert("Numéro non défini");
    return "";
  }

  // 1. Nettoyage : enlever espaces, tirets, parenthèses
  let cleaned = input.replace(/[\s\-()]/g, "");

  console.log("Après nettoyage :", cleaned);

  // 2. Enlever indicatif si présent
  if (cleaned.startsWith("+241")) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith("241")) {
    cleaned = cleaned.slice(3);
  }

  // 3. Enlever le 0 devant si présent
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  console.log("Après retrait indicatif et 0:", cleaned);

  // 4. Correction si longueur incorrecte
  if (cleaned.length === 8) {
    console.log("Numéro valide directement.");
  } else if (cleaned.length === 7) {
    console.log("Numéro incomplet, tentative de correction...");
    const firstDigit = cleaned.charAt(0);

    if (["2", "3", "5", "6"].includes(firstDigit)) {
      // On suppose que c’est un ancien 06 -> on rajoute 6 devant
      cleaned = "6" + cleaned;
    } else if (["4", "7", "8", "9"].includes(firstDigit)) {
      // On suppose que c’est un ancien 07 -> on rajoute 7 devant
      cleaned = "7" + cleaned;
    } else {
      throw new Error("Impossible de corriger ce numéro automatiquement");
    }
  } else {
    throw new Error("Numéro trop court ou trop long après nettoyage");
  }

  // 5. Renvoyer dans le bon format
  return `+241${cleaned}`;
}
