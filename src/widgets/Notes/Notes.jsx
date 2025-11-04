import { useState, useEffect } from 'react';
import styles from './Notes.module.css';

export default function Notes() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chevron_notes_content');
    if (saved) {
      setContent(saved);
    }
    setIsLoading(false);
  }, []);

  // Save notes to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('chevron_notes_content', content);
    }
  }, [content, isLoading]);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className={styles.notes}>
      <div className={styles.header}>
        <span className={styles.title}>Notes</span>
      </div>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={handleChange}
        placeholder="Start typing your notes here..."
        spellCheck="false"
      />
    </div>
  );
}
