import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';


export default function Layout({ children }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    header: {
      padding: '20px',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderBottom: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footer: {
      padding: '20px',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderTop: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
      textAlign: 'center',
      marginTop: 'auto',
    },
    content: {
      flex: 1,
      padding: '20px',
    },
    toggleButton: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: isDarkMode ? '#333' : '#eee',
      color: isDarkMode ? '#fff' : '#000',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/">
          <img
            src={isDarkMode ? "/bonapphedi_logo_dark.png" : "/bonapphedi_logo_light.png"}
            alt="BonApp'Hédi Logo"
            style={{
              transition: "opacity 0.3s ease-in-out",
            }}
            width={100}
            height={100}
          />
        </Link>
        <button onClick={toggleTheme} style={styles.toggleButton}>
          {isDarkMode ? '🌞' : '🌜'}
        </button>
      </header>
      <main style={styles.content}>{children}</main>
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} BonApp&apos; Hédi.</p>
      </footer>
    </div>
  );
}
