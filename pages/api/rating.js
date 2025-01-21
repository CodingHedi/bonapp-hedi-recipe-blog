import fs from "fs";
import path from "path";
import matter from "gray-matter";

const filePath = path.join(process.cwd(), "content", "rating.md");

// Ensure the file exists
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "---\nratings: {}\n---\n");
}

export default function handler(req, res) {
    if (req.method === "GET") {
        const { slug } = req.query;

        if (!slug) {
            return res.status(400).json({ message: "Slug is required" });
        }

        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);

        const ratings = data.ratings?.[slug] || [];
        const average =
            ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

        return res.status(200).json({ ratings, average });
    }

    if (req.method === "POST") {
        const { slug, rating } = req.body;

        if (!slug || typeof rating !== "number") {
            return res.status(400).json({ message: "Invalid input" });
        }

        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);

        if (!data.ratings) {
            data.ratings = {};
        }

        // Add new rating
        if (!Array.isArray(data.ratings[slug])) {
            data.ratings[slug] = [];
        }
        data.ratings[slug].push(rating);

        // Convert updated data back to markdown
        const updatedMarkdown =
            "---\n" + `ratings: ${JSON.stringify(data.ratings, null, 2)}\n` + "---\n" + content;

        fs.writeFileSync(filePath, updatedMarkdown);

        const average =
            data.ratings[slug].reduce((sum, r) => sum + r, 0) / data.ratings[slug].length;

        return res.status(200).json({ ratings: data.ratings[slug], average });
    }

    res.status(405).json({ message: "Method not allowed" });
}
