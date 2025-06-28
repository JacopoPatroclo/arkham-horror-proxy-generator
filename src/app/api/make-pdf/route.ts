import { getCards, makeProxyPdf } from "@/lib/pdf-generator";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");

  const lines = content?.toString().split("\n");
  const cardIds = lines?.flatMap((line) => {
    const [count, ...code] = line.split(" ").map((str) => str.trim());
    return Array.from({ length: parseInt(count.replaceAll(/X|x/g, "")) }, () =>
      code.join(" "),
    );
  });

  if (!cardIds || cardIds.length === 0) {
    return new Response("No cards provided", { status: 400 });
  }

  console.log("CARDS:", cardIds);

  const cards = await getCards(cardIds);

  if (!cards || cards.length === 0) {
    return new Response("No cards found, check some codes", { status: 404 });
  }

  const pdf = await makeProxyPdf(cards);

  const headers = new Headers();
  headers.set("content-type", "application/pdf");
  headers.set("content-disposition", 'inline; filename="streamed.pdf"');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = new Response(pdf as any, {
    headers,
  });

  pdf.end();

  return response;
}
