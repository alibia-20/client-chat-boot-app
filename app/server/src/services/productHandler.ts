import { NewProduct, ProductElement } from "../models";
import humanSleep from "../utils/humanSleep";
import removeAccents from "remove-accents";

function normalizeText(text: string): string {
  return removeAccents(text).toLowerCase();
}

function splitWords(text: string): string[] {
  return text
    .replace(/[^\w\s]/g, "") // enlever ponctuation
    .split(/\s+/)
    .filter(Boolean);
}

export default async function handleProduct(
  clientInstance: any,
  senderId: string,
  rawText: string
): Promise<boolean> {
  const normalizedText = normalizeText(rawText);
  const messageWords = splitWords(normalizedText);

  console.log("🧹 Message normalisé :", normalizedText);
  console.log("🔍 Mots extraits du message :", messageWords);

  const allProducts = await NewProduct.findAll({
    include: [{ model: ProductElement, as: "elements" }],
  });

  const matchedProducts: typeof allProducts = [];

  for (const product of allProducts) {
    const rawKeywords = [product.keyword, ...(product.synonym?.split(/[,;|]+/) || [])];
    const keywords = rawKeywords.map((kw) => normalizeText(kw.trim())).filter(Boolean);

    let matched = false;

    for (const keyword of keywords) {
      if (keyword.includes(" ")) {
        // 🔍 Cas d’un mot-clé composé (avec espace)
        if (normalizedText.includes(keyword)) {
          matched = true;
          break;
        }
      } else {
        // 🔍 Cas d’un mot-clé simple
        if (messageWords.includes(keyword)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      matchedProducts.push(product);
      console.log(`✅ Produit trouvé pour mot clé/synonyme dans message : ${product.keyword}`);
    }
  }

  if (matchedProducts.length === 0) {
    console.log("❌ Aucun produit ne correspond au message.");
    return false;
  }

  for (const product of matchedProducts) {
    if (Array.isArray(product.elements)) {
      const sortedElements = product.elements.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      for (const element of sortedElements) {
        await humanSleep();

        if (element.type === "text" && element.content) {
          await clientInstance.sendText(senderId, element.content);
        }

        if (
          element.type === "image" &&
          typeof element.imageUrl === "string" &&
          element.imageUrl
        ) {
          const fullImageUrl = element.imageUrl.startsWith("/")
            ? `${process.env.BASE_URL}${element.imageUrl}`
            : `${process.env.BASE_URL}/${element.imageUrl}`;

          await clientInstance.sendImage(
            senderId,
            fullImageUrl,
            "image.jpg",
            element.caption || ""
          );
        }
      }
    }

    console.log(`📦 Infos envoyées pour produit : ${product.keyword}`);
  }

  return true;
}
