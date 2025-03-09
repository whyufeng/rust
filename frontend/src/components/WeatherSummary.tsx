import { Grid, GridItem, Box, Text, Icon } from '@chakra-ui/react';
import { WiHumidity, WiCloudy, WiStrongWind, WiThermometer } from 'react-icons/wi';
import { useWeather } from '../context/WeatherContext';

export function WeatherSummary() {
  const { weather } = useWeather();

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
      <GridItem>
        <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center" height="100%">
          <Icon as={WiThermometer} w={8} h={8} />
          <Text fontSize="2xl">{weather?.temperature ?? 0}°C</Text>
          <Text mt="auto">Temperature</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center" height="100%">
          <Icon as={WiHumidity} w={8} h={8} />
          <Text fontSize="2xl">{weather?.humidity ?? 0}%</Text>
          <Text mt="auto">Humidity</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center" height="100%">
          <Icon as={WiCloudy} w={8} h={8} />
          <Text fontSize="2xl">{weather?.cloud_cover ?? 0}%</Text>
          <Text mt="auto">Cloud Cover</Text>
        </Box>
      </GridItem>
      <GridItem>
        <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center" height="100%">
          <Icon as={WiStrongWind} w={8} h={8} />
          <Text fontSize="2xl">{weather?.wind_speed ?? 0} m/s</Text>
          <Text mt="auto">Wind Speed</Text>
        </Box>
      </GridItem>
    </Grid>
  );
} 