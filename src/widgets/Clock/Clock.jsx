import { useState, useEffect } from 'react';
import styles from './Clock.module.css';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = time.toLocaleDateString('en-US', options);

  return (
    <div className={styles.clock}>
      <div className={styles.time}>
        {hours}:{minutes}:{seconds}
      </div>
      <div className={styles.date}>
        {dateString}
      </div>
    </div>
  );
}
