import { Product } from "@/types/product";

export function mapKaprukaProduct(rawData: string): Product {
    const lines = rawData.split("\n");

    const nameLine = lines.find((line) => line.startsWith("## ")) ?? "";
    const name = nameLine.replace("## ", "").trim();

    const idLine = lines.find((line) => line.includes("**ID**"));
    const id = idLine
        ? idLine.match(/`([^`]+)`/)?.[1] ?? ""
        : "";

    const priceLine = lines.find((line) => line.includes("**Price**"));
    const price = priceLine
        ? Number(
            priceLine
                .replace("**Price**: LKR", "")
                .replace(/,/g, "")
                .trim()
        )
        : 0;

    const imageLine = lines.find((line) => line.includes("**Image**"));
        const image = imageLine
        ? imageLine.replace("**Image**:", "").trim()
        : "";

    const stockLine = lines.find((line) => line.includes("**Stock**"));
    const stock = stockLine
        ? stockLine.replace("**Stock**:", "").trim()
        : "";


    const categoryLine = lines.find((line) =>
        line.includes("**Category**")
    );
    const category = categoryLine
        ? categoryLine.replace("**Category**:", "").trim()
        : "";

    const urlLine = lines.find((line) =>
        line.includes("[View on Kapruka]")
    );

    const url = urlLine
        ? urlLine.match(/\((.*?)\)/)?.[1] ?? ""
        : "";


    const imageIndex = lines.findIndex((line) =>
        line.includes("**Image**")
    );
    const description = imageIndex > -1
        ? lines
            .slice(8, imageIndex)
            .join(" ")
            .trim()
        : "";



    return {
        id,
        name,
        price,
        image,
        stock,
        category,
        description,
        url,
    }
}