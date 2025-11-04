import { useAtom } from 'jotai';
import { currentModeAtom } from '../../../store/atoms';
import { Card, Box, Typography, Button } from '@mui/joy';
import styles from './ModeSelector.module.css';

export default function ModeSelector() {
  const [currentMode, setCurrentMode] = useAtom(currentModeAtom);

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        borderRadius: '12px'
      }}
    >
      <Typography level="h4" sx={{ mb: 1.5 }}>
        Start Mode
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2, opacity: 0.7 }}>
        Choose your preferred start page experience
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant={currentMode === 'simple' ? 'solid' : 'outlined'}
          color={currentMode === 'simple' ? 'primary' : 'neutral'}
          onClick={() => setCurrentMode('simple')}
          sx={{
            flexDirection: 'column',
            py: 2,
            height: 'auto'
          }}
        >
          <Typography level="body-md" fontWeight="lg">
            Simple Start
          </Typography>
          <Typography level="body-xs" sx={{ mt: 0.5, opacity: 0.8 }}>
            Minimalist search experience
          </Typography>
        </Button>

        <Button
          fullWidth
          variant={currentMode === 'bold' ? 'solid' : 'outlined'}
          color={currentMode === 'bold' ? 'primary' : 'neutral'}
          onClick={() => setCurrentMode('bold')}
          sx={{
            flexDirection: 'column',
            py: 2,
            height: 'auto'
          }}
        >
          <Typography level="body-md" fontWeight="lg">
            Bold Start
          </Typography>
          <Typography level="body-xs" sx={{ mt: 0.5, opacity: 0.8 }}>
            Command-driven interface
          </Typography>
        </Button>
      </Box>
    </Card>
  );
}
