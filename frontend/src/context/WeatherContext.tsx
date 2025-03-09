import { createContext, useContext, useState, ReactNode } from 'react';

type WeatherData = {
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

type WeatherContextType = {
    weather: WeatherData | null;
    setWeather: (weather: WeatherData | null) => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    return (
        <WeatherContext.Provider value={{ weather, setWeather }}>
            {children}
        </WeatherContext.Provider>
    );
}

export function useWeather() {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
} 