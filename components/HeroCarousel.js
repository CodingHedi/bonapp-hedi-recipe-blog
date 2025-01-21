import { useState, useEffect } from 'react';
import { useTheme } from "@/context/ThemeContext";

export default function HeroCarousel({ recipes }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isDarkMode } = useTheme();

    const styles = {
        container: {
            position: 'relative',
            width: '60%',
            height: '400px',
            overflow: 'hidden',
            margin: '0 auto',
        },
        carousel: {
            display: 'grid',
            gridTemplateColumns: `repeat(${recipes.length}, 100%)`,
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
        },
        slide: {
            width: '100%',
            height: '100%',
            position: 'relative',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        content: {
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: isDarkMode ? 'rgba(250, 250, 250, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '5px',
            color: isDarkMode ? '#000' : '#fff',
            maxWidth: '60%',
        },
        title: {
            fontSize: '24px',
            margin: '0',
        },
        description: {
            fontSize: '16px',
            marginTop: '10px', marginBottom: '10px',

        },
        button: {
            marginTop: '20px',
            padding: '10px 15px',
            backgroundColor: isDarkMode ? '#333' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
        },
        navButton: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            color: isDarkMode ? '#000' : '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '20%',
            cursor: 'pointer',
        },
        navPrev: {
            left: '10px',
        },
        navNext: {
            right: '10px',
        },
    };

    // Auto-loop every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === recipes.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [recipes.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === recipes.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.carousel}>
                {recipes.map((recipe, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.slide,
                            backgroundImage: `url(${recipe.frontMatter.image})`,
                        }}
                    >
                        <div style={styles.content}>
                            <h2 style={styles.title}>{recipe.frontMatter.title}</h2>
                            <p style={styles.description}>{recipe.frontMatter.description}</p>
                            <a href={`/posts/${recipe.slug}`} style={styles.button}>
                                Lire la suite
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <button
                style={{ ...styles.navButton, ...styles.navPrev }}
                onClick={handlePrev}
            >
                ‹
            </button>
            <button
                style={{ ...styles.navButton, ...styles.navNext }}
                onClick={handleNext}
            >
                ›
            </button>
        </div>
    );
}
