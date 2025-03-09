import { Box } from '@chakra-ui/react';
import { WeatherDashboard } from './components/WeatherDashboard';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <WeatherProvider>
      <Box>
        <WeatherDashboard />
      </Box>
    </WeatherProvider>
  );
}

export default App; 