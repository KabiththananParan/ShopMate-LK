export function normalizeTanglish(
    text: string
) {
    return text
        .toLowerCase()

        .replace(
            /\bmama\b/g,
            ""
        )

        .replace(
            /\bmata\b/g,
            ""
        )

        .replace(
            /\bganna oni\b/g,
            ""
        )

        .replace(
            /\bcake ekak\b/g,
            "cake"
        )

        .replace(
            /\bflower ekak\b/g,
            "flowers"
        )

        .replace(
            /\byawanawa\b/g,
            ""
        )

        .replace(
            /\bdelivery karanna\b/g,
            "deliver"
        )

        .replace(
            /\s+/g,
            " "
        )

        .replace(
            /\bbuy\b/g,
            ""
        )
        .replace(
            /\bsend\b/g,
            ""
        )

        .trim();
}