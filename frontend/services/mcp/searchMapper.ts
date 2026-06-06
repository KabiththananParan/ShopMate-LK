import { Product } from "@/types/product";

export function mapSearchResults(rawText: string): Product[] {
  const products: Product[] = [];

  const sections = rawText
    .split(/\n(?=\*\*\d+\.)/)
    .filter((section) => section.trim().startsWith("**"));

  for (const section of sections) {
    const lines = section.split("\n");

    const titleLine = lines[0] ?? "";
    const detailsLine = lines[1]?.trim() ?? "";
    const urlLine = lines[2]?.trim() ?? "";

    const name = titleLine
      .replace(/\*\*/g, "")
      .replace(/^\d+\.\s*/, "")
      .trim();

    const id =
      detailsLine.match(/`([^`]+)`/)?.[1] ?? "";

    const priceMatch = detailsLine.match(
      /LKR\s+([\d,]+)/
    );

    const price = priceMatch
      ? Number(priceMatch[1].replace(/,/g, ""))
      : 0;

    const stockMatch = detailsLine.match(
        /LKR\s+[\d,]+\s+·\s+(.*?)\s+·\s+ships/
    );

    const stock = stockMatch?.[1] ?? "";

    const url =
      urlLine.match(/\((.*?)\)/)?.[1] ?? "";

    products.push({
      id,
      name,
      price,
      image: "",
      stock,
      category: "",
      description: "",
      url,
    });
  }

  return products;
}