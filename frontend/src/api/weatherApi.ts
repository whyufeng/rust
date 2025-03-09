import type { WeatherData, ApiResponse, WeatherHistoryData } from '../types/weather';

const API_BASE = '/api';

export const weatherApi = {
    async getRecentWeather(): Promise<WeatherData> {
        const response = await fetch(`${API_BASE}/recent_weather`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const apiData: ApiResponse = await response.json();

        return {
            ...apiData,
            temperature_min: apiData.temp_min,
            temperature_max: apiData.temp_max,
            temperature: apiData.temp,
            wind_speed: apiData.wind,
            cloud_cover: apiData.cloud
        };
    },
    async getWeatherHistory(city: string): Promise<WeatherHistoryData[]> {
        const response = await fetch(`${API_BASE}/weather_history/${encodeURIComponent(city)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch temperature history');
        }
        return await response.json();
    }
}; 