export function normalizeSinhala(
    text: string
) {
    return text

        // cakes
        .replace(
            /කේක් එකක් ඕන|කේක් ඕන|කේක්/g,
            "cake"
        )

        // flowers
        .replace(
            /මල් යවන්න ඕන|මල් ඕන|මල්/g,
            "flowers"
        )

        // gifts
        .replace(
            /තෑගි|ගිෆ්ට්/g,
            "gifts"
        )

        // delivery
        .replace(
            /ඩිලිවර් කරන්න|යවන්න/g,
            "deliver"
        )

        // locations
        .replace(
            /යාපනය/g,
            "Jaffna"
        )

        .replace(
            /කොළඹ/g,
            "Colombo"
        )

        .replace(
            /මහනුවර/g,
            "Kandy"
        )

        // common fillers
        .replace(
            /මට/g,
            ""
        )

        .replace(
            /ඕන/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();
}