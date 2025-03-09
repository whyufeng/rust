import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { weatherApi } from '../api/weatherApi';
import type { WeatherHistoryData } from '../types/weather';
import { useWeather } from '../context/WeatherContext';



export function WeatherChart() {
  const [data, setData] = useState<WeatherHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { weather } = useWeather();

  useEffect(() => {
    const fetchData = async () => {
      if (!weather?.city) return;

      setLoading(true);
      try {
        const historyData = await weatherApi.getWeatherHistory(weather.city);
        setData(historyData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Data Fetching Failed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weather?.city]);

  if (loading) {
    return (
      <Box w="100%" h="400px" p={4} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box w="100%" h="400px" p={4} display="flex" alignItems="center" justifyContent="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box w="100%" h="400px" p={4}>
      <Heading size="md" mb={4}>Temperature & Humidity Trends</Heading>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fontFamily: 'system-ui' }}
          />
          <YAxis
            yAxisId="temperature"
            label={{
              value: 'Temperature (°C)',
              angle: -90,
              position: 'insideLeft',
              style: {
                fontSize: 14,
                fontFamily: 'system-ui',
                fontWeight: 500
              }
            }}
            tick={{ fontSize: 12, fontFamily: 'system-ui' }}
          />
          <YAxis
            yAxisId="humidity"
            orientation="right"
            label={{
              value: 'Humidity (%)',
              angle: 90,
              position: 'insideRight',
              style: {
                fontSize: 14,
                fontFamily: 'system-ui',
                fontWeight: 500
              }
            }}
            tick={{ fontSize: 12, fontFamily: 'system-ui' }}
          />
          <Tooltip
            contentStyle={{
              fontSize: 14,
              fontFamily: 'system-ui'
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 14,
              fontFamily: 'system-ui'
            }}
          />
          <Line
            yAxisId="temperature"
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
            name="Temperature"
            strokeWidth={3}
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            stroke="#82ca9d"
            name="Humidity"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
} 