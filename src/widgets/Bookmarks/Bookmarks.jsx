import { useState, useEffect } from 'react';
import { hasPermission, requestPermission } from '../../lib/permissions';
import styles from './Bookmarks.module.css';

export default function Bookmarks() {
  const [hasBookmarkPermission, setHasBookmarkPermission] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermissionAndLoad();
  }, []);

  const checkPermissionAndLoad = async () => {
    const permitted = await hasPermission('bookmarks');
    setHasBookmarkPermission(permitted);

    if (permitted) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      if (chrome?.bookmarks) {
        const tree = await chrome.bookmarks.getTree();
        const flatBookmarks = extractBookmarks(tree[0]);
        setBookmarks(flatBookmarks.slice(0, 10)); // Show top 10
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractBookmarks = (node, depth = 0, result = []) => {
    if (node.url && depth <= 3) {
      result.push({
        id: node.id,
        title: node.title,
        url: node.url,
      });
    }

    if (node.children) {
      node.children.forEach(child => extractBookmarks(child, depth + 1, result));
    }

    return result;
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission('bookmarks');
    if (granted) {
      setHasBookmarkPermission(true);
      loadBookmarks();
    }
  };

  const handleBookmarkClick = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className={styles.bookmarks}>
        <div className={styles.header}>
          <span className={styles.title}>Bookmarks</span>
        </div>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!hasBookmarkPermission) {
    return (
      <div className={styles.bookmarks}>
        <div className={styles.header}>
          <span className={styles.title}>Bookmarks</span>
        </div>
        <div className={styles.permissionPrompt}>
          <p className={styles.permissionText}>
            This widget needs access to your bookmarks
          </p>
          <button
            className={styles.permissionButton}
            onClick={handleRequestPermission}
          >
            Grant Permission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookmarks}>
      <div className={styles.header}>
        <span className={styles.title}>Bookmarks</span>
        <span className={styles.count}>({bookmarks.length})</span>
      </div>
      <div className={styles.list}>
        {bookmarks.length === 0 ? (
          <div className={styles.empty}>No bookmarks found</div>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className={styles.bookmark}
              onClick={() => handleBookmarkClick(bookmark.url)}
            >
              <div className={styles.favicon}>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=16`}
                  alt=""
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
              <span className={styles.bookmarkTitle}>{bookmark.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
