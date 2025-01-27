import React, { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "@/components/TimeAgo";
import { Post } from "@/utils/Post";
import { useTheme } from "@/context/ThemeContext";

interface CardProps {
  post: Post;
  handleTagClick: (tag: string) => void;
}

const Card: React.FC<CardProps> = ({ post, handleTagClick }) => {
  const slug = post.slug;
  const title = post.frontMatter.title;
  const description = post.frontMatter.description;
  const author = post.frontMatter.author;
  const image = post.frontMatter.image;
  const tags = post.frontMatter.tags;
  const date = post.frontMatter.date;

  const isDarkMode = useTheme();

  const compareStrings = (str1: string, str2: string): boolean => {
    const collator = new Intl.Collator(undefined, { sensitivity: "base", ignorePunctuation: true });
    return collator.compare(str1, str2) === 0;
  };

  const truncateText = (text: string, maxLength: number): ReactElement => {
    if (text.length <= maxLength) {
      return <>{text}</>;
    }
    const truncated = text.slice(0, maxLength);

    // Find the last space within the truncated part
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    // Ensure we don't cut in the middle of a word
    const result = lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) : truncated;

    return (
      <>
        {result}...{" "}
        <span
          style={{
            color: isDarkMode ? "var(--text-muted)" : "var(--text-color)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          read more 🡆
        </span>
      </>
    );
  };

  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      backgroundColor: "var(--card-bg)",
      color: "var(--text-color)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    imageContainer: {
      width: "100%",
      height: "200px", // Fixed height for the image
      overflow: "hidden",
      position: "relative",
      objectFit: "cover",
      display: "flex",
      alignItems: "center",
    },
    cardImage: {
      width: "100%",
    },
    contentDisplay: {
      padding: "16px",
      flex: "1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    description: {
      fontSize: "0.9rem",
      color: "var(--text-muted)",
      marginBottom: "16px",
      lineHeight: "1.4",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    authorContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "4px",
    },
    avatarRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    avatar: {
      borderRadius: "50%",
    },
    cardTags: {
      direction: "rtl",
      marginTop: "10px",
      marginLeft: "5px",
      marginRight: "5px",
      marginBottom: "10px",
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
    },
    tag: {
      padding: "5px",
      border: "1px solid",
      borderColor: isDarkMode ? "#333" : "#ddd",
      backgroundColor: isDarkMode ? "#555" : "#f0f0f0",
      color: isDarkMode ? "#fff" : "#333",
      borderRadius: "10px",
      fontSize: "12px",
      cursor: "pointer",
      transition: "background-color 0.3s, color 0.3s",
    },
    selectedTag: {
      border: "1px solid",
      borderColor: isDarkMode ? "#555" : "#eee",
      backgroundColor: isDarkMode ? "#777" : "#ddd",
      color: isDarkMode ? "#fff" : "#000",
    },
  };

  return (
    <div
      style={styles.card}
      onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <Link href={`/posts/${slug}`}>
        <div style={styles.imageContainer}>
          <img src={image} alt={title} style={styles.cardImage} />
        </div>
      </Link>
      <div style={styles.contentDisplay}>
        <Link href={`/posts/${slug}`}>
          <h3 style={styles.title}>{title}</h3>
        </Link>
        <p style={styles.description}>{description ? truncateText(description, 100) : ""}</p>
        <div style={styles.footer}>
          <div style={styles.authorContainer}>
            <br />
            <div style={styles.avatarRow}>
              {compareStrings(author, "angry hedi") ? (
                <Image src="/bonapphedi_avatar_toldyouso.png" alt="Hédi" width={40} height={40} style={styles.avatar} />
              ) : compareStrings(author, "hedi") ? (
                <Image src="/bonapphedi_avatar_hedi.png" alt="Hédi" width={40} height={40} style={styles.avatar} />
              ) : (
                <Image src="/bonapphedi_avatar_other.png" alt="Other" width={40} height={40} style={styles.avatar} />
              )}
              <span>{author}</span>
            </div>
            <TimeAgo date={date} />
          </div>
          <span>
            {tags && (
              <div>
                <div style={styles.cardTags}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        ...styles.tag,
                      }}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
