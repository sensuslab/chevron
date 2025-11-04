import { useContext } from 'react';
import { ColorSchemeContext, ThemeContext } from '../../contexts/Settings';
import ActiveElements from '../../components/ActiveElements/ActiveElements';
import QueryField from '../../components/QueryField/QueryField';
import styles from './BoldStart.module.css';

export default function BoldStart() {
  const theme = useContext(ThemeContext);
  const colorScheme = useContext(ColorSchemeContext);

  return (
    <div className={styles.container}>
      <ActiveElements />
      <div className={styles.greeting}>
        <span className={styles.greetingText}>Hello,</span>
      </div>
      <QueryField />
    </div>
  );
}
