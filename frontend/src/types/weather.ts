export type WeatherData = {
    city: string;
    temperature?: number;
    temperature_min: number;
    temperature_max: number;
    humidity: number;
    wind_speed: number;
    cloud_cover: number;
    sunrise: string;
    sunset: string;
    description: string;
    record_time: string;
}

export type WeatherHistoryData = {
    time: string;
    temperature: number;
    humidity: number | null;
}

export type ApiResponse = {
    city: string;
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    wind: number;
    wind_deg: number;
    cloud: number;
    sunrise: string;
    sunset: string;
    description: string;
    record_time: string;
} 