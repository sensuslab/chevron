import { useState } from 'react';
import { useAtom } from 'jotai';
import { wallpaperSettingsAtom, quoteSettingsAtom } from '../../store/atoms';
import styles from './SimpleStart.module.css';

export default function SimpleStart() {
  const [searchQuery, setSearchQuery] = useState('');
  const [wallpaperSettings] = useAtom(wallpaperSettingsAtom);
  const [quoteSettings] = useAtom(quoteSettingsAtom);
  const [quote, setQuote] = useState({
    text: 'The journey of a thousand miles begins with one step.',
    author: 'Lao Tzu'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Default to Google search
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Generate background style based on settings
  const getBackgroundStyle = () => {
    switch (wallpaperSettings.type) {
      case 'color':
        return { backgroundColor: wallpaperSettings.color };
      case 'custom':
        return {
          backgroundImage: `url(${wallpaperSettings.customUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'unsplash':
        // For MVP, use a static Unsplash URL
        return {
          backgroundImage: `url(https://source.unsplash.com/1920x1080/?${wallpaperSettings.unsplashCategory})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      default:
        return { backgroundColor: '#1a1a1a' };
    }
  };

  return (
    <div className={styles.container} style={getBackgroundStyle()}>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search the web..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </form>

        {quoteSettings.enabled && (
          <div className={styles.quote}>
            <p className={styles.quoteText}>"{quote.text}"</p>
            <p className={styles.quoteAuthor}>— {quote.author}</p>
          </div>
        )}
      </div>
    </div>
  );
}
