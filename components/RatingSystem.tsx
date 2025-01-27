import { useState, useEffect } from "react";

interface RatingSystemProps {
  slug: string; // Recipe identifier
}

const ALREADY_RATED = "You've already rated this recipe.";
const FAIL_RATE = "Failed to submit rating";

const RatingSystem: React.FC<RatingSystemProps> = ({ slug }) => {
  const [, setRatings] = useState<number[]>([]);
  const [average, setAverage] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Fetch existing ratings for the recipe
    fetch(`/api/rating?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setRatings(data.ratings || []);
        setAverage(data.average || 0);
      })
      .catch((err) => console.error("Error fetching ratings:", err));

    // Check if the user has already rated this recipe in localStorage
    const userRating = localStorage.getItem(`rated-${slug}`);
    if (userRating) {
      setHasRated(true);
      setMessage(ALREADY_RATED);
    }
  }, [slug]);

  const handleRating = async (newRating: number) => {
    if (hasRated) {
      alert(ALREADY_RATED);
      return;
    }
    const res = await fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, rating: newRating }),
    });

    if (res.ok) {
      const updatedData = await res.json();
      setRatings(updatedData.ratings);
      setAverage(updatedData.average);
      setHasRated(true);
      setMessage("Thank you for rating this recipe!");

      // Store in localStorage to prevent re-rating
      localStorage.setItem(`rated-${slug}`, "true");

      // Automatically change message after 3 seconds
      setTimeout(() => {
        setMessage(ALREADY_RATED);
      }, 3000);
    } else {
      console.error(FAIL_RATE);
    }
  };

  return (
    <div>
      <h3>Rate this recipe:</h3>
      <div style={{ display: "flex", gap: "5px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              cursor: "pointer",
              color: star <= Math.round(average) ? "gold" : "gray",
              fontSize: "24px",
            }}
            onClick={() => !hasRated && handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <p>Average Rating: {average.toFixed(1)} / 5</p>
      {message && <p style={{ fontStyle: "italic", fontSize: "12px" }}>{message}</p>}
    </div>
  );
};

export default RatingSystem;
