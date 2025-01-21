import { useState, useRef, useEffect } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useTheme } from "@/context/ThemeContext";
import RatingSystem from "@/components/RatingSystem";

export default function RecipePage({ frontMatter }) {
    const [servings, setServings] = useState(1);
    const { isDarkMode } = useTheme();
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            padding: "20px",
        },
        twoColumns: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
        },
        leftColumn: {
            display: "flex",
            flexDirection: "column",
        },
        rightColumn: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        },
        video: {
            width: "100%",
            height: "315px",
            borderRadius: "10px",
            marginBottom: "20px",
        },
        steps: {
            marginTop: "20px",
            padding: "10px",
            backgroundColor: isDarkMode ? "#1a1a1a" : "#e9e9e9",
            borderRadius: "10px",
        },
        step: {
            marginBottom: "10px",
            cursor: "pointer",
        },
        tags: {
            margin: "10px 0",
            display: "flex",
            gap: "10px",
        },
        tag: {
            padding: "5px 10px",
            backgroundColor: isDarkMode ? "#333" : "#eee",
            borderRadius: "15px",
            fontSize: "12px",
        },
        ingredients: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
        },
        tableHeader: {
            backgroundColor: isDarkMode ? "#333" : "#eee",
        },
        tableCell: {
            border: "1px solid",
            borderColor: isDarkMode ? "#444" : "#ccc",
            padding: "8px",
            textAlign: "left",
        },
        adjustServings: {
            margin: "20px 0",
            display: "flex",
            gap: "10px",
            alignItems: "center",
        },
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.YT) {
            console.log("YouTube IFrame API is already available.");
            return;
        }

        console.log("Loading YouTube IFrame API...");
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);

        function onYouTubeIframeAPIReady() {
            console.log("YouTube IFrame API is ready.");
            console.log("Video URL : ", frontMatter.videoUrl);
            const truncatedUrl = frontMatter.videoUrl.split("/embed/")[1].substring(0, 11);
            console.log("Truncated URL : ", truncatedUrl);
            playerRef.current = new window.YT.Player(videoRef.current, {
                videoId: truncatedUrl,
            });
        }

        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

        return () => {
            console.log("Cleaning up YouTube IFrame API script...");
            document.body.removeChild(script);
        };
    }, []);

    const seekTo = (time) => {
        console.log("Attempting to seek to timestamp:", time);

        if (!playerRef.current) {
            console.error("Video player reference is null.");
            return;
        }
        const seconds = parseTimestamp(time);
        console.log("Seeking to seconds:", seconds);
        playerRef.current.seekTo(seconds, true);

    };

    const parseTimestamp = (timestamp) => {
        console.log("Parsing timestamp:", timestamp);
        const parts = timestamp.split(":").map(Number);
        return parts.reduce((total, part) => total * 60 + part, 0);
    };

    const handleServingsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) setServings(value);
    };

    return (
        <div style={styles.container}>
            <div style={styles.twoColumns}>
                {/* Left Column */}
                <div style={styles.leftColumn}>
                    {/* Embed Video */}
                    <div ref={videoRef} style={styles.video} title={frontMatter.title}>
                        {/* The iframe is created at the runtime */}
                    </div>
                    {/* Recipe Steps */}
                    <div style={styles.steps}>
                        <h3>Steps</h3>
                        {frontMatter.steps.map((step, index) => {
                            const match = step.match(/\[(\d+:\d+)\]/); // Match [mm:ss] format
                            const timestamp = match ? match[1] : null;

                            return (
                                <p
                                    key={index}
                                    style={{
                                        ...styles.step,
                                        cursor: timestamp ? "pointer" : "default",
                                    }}
                                    onClick={() => {
                                        console.log("Step clicked:", step);
                                        if (timestamp) seekTo(timestamp);
                                    }}
                                >
                                    Step {index + 1}: {step.replace(/\[\d+:\d+\]/, "").trim()}
                                    {timestamp && (
                                        <span style={{ color: "blue" }}> ({timestamp})</span>
                                    )}
                                </p>
                            );
                        })}
                    </div>
                </div>
                {/* Right Column */}
                <div style={styles.rightColumn}>
                    {/* Recipe presentation */}
                    <h1>{frontMatter.title}</h1>
                    <p>{frontMatter.description}</p>
                    {/* Rating System */}
                    <RatingSystem slug={frontMatter.slug} />
                    {/* Tags */}
                    <div style={styles.tags}>
                        {frontMatter.tags.map((tag, index) => (
                            <span key={index} style={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    {/* Ingredients */}
                    <div style={styles.adjustServings}>
                        <label htmlFor="servings">Adjust Servings:</label>
                        <input
                            id="servings"
                            type="number"
                            value={servings}
                            onChange={handleServingsChange}
                            min="1"
                            style={{
                                width: "50px",
                                backgroundColor: isDarkMode ? "#333" : "#eee",
                            }}
                        />
                    </div>
                    <table style={styles.ingredients}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableCell}>Ingredient</th>
                                <th style={styles.tableCell}>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {frontMatter.ingredients.map((ingredient, index) => {
                                const convertUnit = (quantity, unit) =>
                                    unit === "g" && quantity >= 1000
                                        ? { quantity: (quantity / 1000).toFixed(1), unit: "kg" }
                                        : unit === "mL" && quantity >= 1000
                                            ? { quantity: (quantity / 1000).toFixed(1), unit: "L" }
                                            : { quantity, unit };

                                const { quantity, unit } = convertUnit(
                                    (ingredient.quantity / 1) * servings,
                                    ingredient.unit
                                );

                                return (
                                    <tr key={index}>
                                        <td style={styles.tableCell}>{ingredient.name}</td>
                                        <td style={styles.tableCell}>
                                            {quantity} {unit}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export async function getStaticPaths() {
    const files = fs.readdirSync(path.join("content"));
    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace(".md", ""),
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const filePath = path.join("content", `${params.slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    return {
        props: {
            frontMatter: { ...data, slug: params.slug },
        },
    };
}
