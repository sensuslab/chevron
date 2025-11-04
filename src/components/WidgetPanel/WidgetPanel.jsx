import { useAtom } from 'jotai';
import { activeWidgetsAtom, widgetLayoutAtom } from '../../store/atoms';
import { widgetMap } from '../../widgets/registry';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WidgetPanel.module.css';

export default function WidgetPanel({ isVisible, onClose }) {
  const [activeWidgets] = useAtom(activeWidgetsAtom);
  const [layout] = useAtom(widgetLayoutAtom);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Widgets</h2>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={styles.grid}>
              {activeWidgets.map((widgetId) => {
                const widget = widgetMap.get(widgetId);
                if (!widget) return null;

                const widgetLayout = layout[widgetId] || widget.defaultLayout;
                const WidgetComponent = widget.component;

                return (
                  <div
                    key={widgetId}
                    className={styles.widget}
                    style={{
                      gridColumn: `span ${widgetLayout.w}`,
                      gridRow: `span ${widgetLayout.h}`,
                    }}
                  >
                    <WidgetComponent />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
