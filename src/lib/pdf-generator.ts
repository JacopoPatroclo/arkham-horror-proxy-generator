import PDFDocument from "pdfkit";

export interface Card {
  code: string;
  imagesrc: string;
  name: string;
  real_name: string;
}

let cardsCache: Card[];
const imageCache = new Map<string, ArrayBuffer>();

export async function getCards(cardCodesOrNames: string[]) {
  if (!cardsCache) {
    const response = await fetch("https://arkhamdb.com/api/public/cards/");
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, body ${await response.text()}`,
      );
    }

    cardsCache = await response.json();
  }

  return cardCodesOrNames
    .map((code) =>
      cardsCache.find(
        (card) =>
          card.code === code ||
          card.name.toLowerCase() === code.toLowerCase() ||
          card.real_name.toLowerCase() === code.toLowerCase(),
      ),
    )
    .filter((card) => card !== undefined);
}

export async function makeProxyPdf(cards: Card[]) {
  const images = await Promise.all(
    cards.map((card) => {
      if (imageCache.has(card.imagesrc)) {
        return imageCache.get(card.imagesrc)!;
      }

      return fetch(`https://arkhamdb.com${card.imagesrc}`)
        .then((resp) => resp.arrayBuffer())
        .then((buff) => {
          imageCache.set(card.imagesrc, buff);
          return buff;
        });
    }),
  );

  const pdf = new PDFDocument({ size: "A4", autoFirstPage: false });

  const width = 180;
  const cardHeight = 251;
  const marginBorder = 27;
  const marginTop = 20;

  let offsetY = marginTop;
  for (let i = 0; i < images.length; i++) {
    const haveToAddPage = i % 9 === 0;
    offsetY = i % 3 === 0 ? offsetY + cardHeight : offsetY;

    if (haveToAddPage) {
      offsetY = marginTop;
      pdf.addPage();
    }

    const x = (i % 3) * width + marginBorder;

    pdf.image(images[i], x, offsetY, { width, height: cardHeight });
  }

  return pdf;
}
