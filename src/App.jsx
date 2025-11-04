import { useContext, useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { ColorSchemeContext, SettingsContext, ThemeContext } from './contexts/Settings';
import { useReset, useStateSelector, useUpdate } from './contexts/Store';
import { currentModeAtom, widgetPanelVisibleAtom } from './store/atoms';
import { AnimatePresence, motion } from 'framer-motion';
import SimpleStart from './features/simple-start/SimpleStart';
import BoldStart from './features/bold-start/BoldStart';
import WidgetPanel from './components/WidgetPanel/WidgetPanel';
import Settings from './components/Settings/Settings';
import LayoutButton from './components/LayoutButton/LayoutButton';
import { BsGearFill, BsChevronRight, BsGrid3X3Gap } from 'react-icons/bs';
import { RiMenu5Fill } from 'react-icons/ri';
import { allowedModes } from './rules';
import { isMobile } from 'react-device-detect';
import classes from './App.module.css';
import './App.css';

const ignoreMobile = localStorage.getItem('ignoreMobile');

function App() {
  // Settings context
  const settings = useContext(SettingsContext);
  const theme = useContext(ThemeContext);
  const colorScheme = useContext(ColorSchemeContext);

  // Jotai atoms for new features
  const [currentMode] = useAtom(currentModeAtom);
  const [widgetPanelVisible, setWidgetPanelVisible] = useAtom(widgetPanelVisibleAtom);

  // Chevron store (for Bold Start mode)
  const mode = useStateSelector(state => state.mode);
  const redirected = useStateSelector(state => state.redirected);
  const timestamp = useStateSelector(state => state.timestamp);
  const updateStore = useUpdate();
  const resetStore = useReset();

  const [showSettings, setShowSettings] = useState(false);
  const [showReset, setShowReset] = useState(false);

  /* Handlers for Bold Start mode */
  const onContextMenuRef = useRef(null);
  const onKeyUpRef = useRef(null);
  const onKeyDownRef = useRef(null);

  function switchMacrosMenu() {
    if (mode === 'default')
      updateStore({ mode: 'opened' });
    else if (mode === 'opened')
      updateStore({ mode: 'default' });
  }

  onKeyUpRef.current = e => {
    if (e.key === 'Shift')
      if (allowedModes.get('Chevron').has(mode))
        if (mode === 'opened')
          updateStore({ mode: 'default' });
  };

  onKeyDownRef.current = e => {
    if (e.key === 'Shift')
      if (allowedModes.get('Chevron').has(mode))
        if (mode === 'default')
          updateStore({ mode: 'opened' });
  };

  onContextMenuRef.current = e => {
    switchMacrosMenu();
    e.preventDefault();
  };

  // Event listeners (only for Bold Start mode)
  useEffect(() => {
    if (currentMode !== 'bold') return;

    const onContextMenu = e => onContextMenuRef.current(e);
    const onKeyUp = e => onKeyUpRef.current(e);
    const onKeyDown = e => onKeyDownRef.current(e);

    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, [currentMode, mode]);

  /* Setting document title */
  useEffect(() => {
    document.title = settings.general.tabTitle;
  }, [settings.general.tabTitle]);

  /* Setting theme variables */
  useEffect(() => {
    const root = document.documentElement;
    for (const variable in theme)
      root.style.setProperty('--' + variable, theme[variable]);
  }, [theme]);

  /* Setting color scheme variables */
  useEffect(() => {
    document.body.setAttribute('data-color-scheme', colorScheme);
  }, [colorScheme]);

  /* Firefox history back caching fix */
  const handleVisibilityChange = useRef(null);
  handleVisibilityChange.current = () => {
    if (document.visibilityState === 'visible' && redirected)
      setShowReset(true);
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', () => handleVisibilityChange.current());
  }, []);

  return (
    <div className='app'>
      {
        !isMobile || ignoreMobile
          ? <>
              <AnimatePresence mode="wait">
                {showSettings ? (
                  <Settings
                    key='settings'
                    onClose={() => {
                      setShowSettings(false);
                      resetStore();
                    }}
                  />
                ) : (
                  <motion.div
                    key={`${currentMode}-${timestamp}`}
                    className={classes['container']}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={redirected || { opacity: 0 }}
                  >
                    {currentMode === 'simple' ? <SimpleStart /> : <BoldStart />}

                    {/* Layout buttons - visible on both modes */}
                    <LayoutButton
                      id='settings'
                      style={{ right: 0, top: 0 }}
                      onClick={() => setShowSettings(state => !state)}
                    >
                      <BsGearFill />
                    </LayoutButton>

                    <LayoutButton
                      id='widgets'
                      style={{ left: 0, top: 0 }}
                      onClick={() => setWidgetPanelVisible(state => !state)}
                    >
                      <BsGrid3X3Gap />
                    </LayoutButton>

                    {/* Macros menu button - only in Bold Start mode */}
                    {currentMode === 'bold' && (
                      <LayoutButton
                        id='macros-menu'
                        style={{ right: 0, bottom: 0 }}
                        onClick={switchMacrosMenu}
                      >
                        {mode === 'default' && <RiMenu5Fill />}
                        {mode === 'opened' && <BsChevronRight />}
                      </LayoutButton>
                    )}

                    {showReset && (
                      <div
                        className={classes['cancel-button']}
                        onClick={() => location.reload()}
                      >
                        Cancel
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Widget Panel Overlay */}
              <WidgetPanel
                isVisible={widgetPanelVisible}
                onClose={() => setWidgetPanelVisible(false)}
              />
            </>
          : <div className={classes['mobile-warning']}>
              <div>
                Mobile devices are not supported :( <br />
                <span
                  className={classes['ignore-mobile-button']}
                  onClick={() => {
                    localStorage.setItem('ignoreMobile', true);
                    location.reload();
                  }}
                >
                  ignore this warning
                </span>
              </div>
            </div>
      }
    </div>
  );
}

export default App;
