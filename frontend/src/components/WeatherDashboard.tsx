import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';
import { useWeather } from '../context/WeatherContext';
import { weatherApi } from '../api/weatherApi';
import { WeatherSummary } from './WeatherSummary';
import { WeatherChart } from './WeatherChart';

export function WeatherDashboard() {
  const { weather, setWeather } = useWeather();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const weatherData = await weatherApi.getRecentWeather();
      setWeather(weatherData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch weather data',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} width="100%">
        <Heading>Weather Dashboard</Heading>

        <Box width="100%">
          <VStack spacing={4}>
            <Button
              colorScheme="blue"
              onClick={fetchWeather}
              isLoading={loading}
              width="100%"
            >
              Get Weather
            </Button>
          </VStack>
        </Box>

        {weather && (
          <Box
            p={6}
            width="100%"
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
          >
            <VStack align="stretch" spacing={3}>
              <Text fontSize="xl" fontWeight="bold">{weather.city}</Text>
              <Text>Temperature: {weather.temperature}°C</Text>
              <Text>Humidity: {weather.humidity}%</Text>
              <Text>Description: {weather.description}</Text>
              <Text>Record Time: {weather.record_time}</Text>
            </VStack>
          </Box>
        )}

        <Box width="100%">
          <WeatherSummary />
        </Box>
        <Box width="100%">
          <WeatherChart />
        </Box>
      </VStack>
    </Container>
  );
} 