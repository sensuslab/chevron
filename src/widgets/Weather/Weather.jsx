import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { apiKeysAtom } from '../../store/atoms';
import styles from './Weather.module.css';

export default function Weather() {
  const [apiKeys] = useAtom(apiKeysAtom);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError('Unable to get location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.lat && location.lon && apiKeys.weather) {
      fetchWeather();
    } else if (location.lat && location.lon && !apiKeys.weather) {
      setError('API key required');
      setLoading(false);
    }
  }, [location, apiKeys.weather]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKeys.weather}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }

      const data = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setError('Failed to load weather');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <div className={styles.weather}>
        <div className={styles.header}>
          <span className={styles.title}>Weather</span>
        </div>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.weather}>
        <div className={styles.header}>
          <span className={styles.title}>Weather</span>
        </div>
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
          {error === 'API key required' && (
            <p className={styles.errorHint}>
              Add your OpenWeatherMap API key in Settings
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={styles.weather}>
        <div className={styles.header}>
          <span className={styles.title}>Weather</span>
        </div>
        <div className={styles.error}>No weather data</div>
      </div>
    );
  }

  return (
    <div className={styles.weather}>
      <div className={styles.header}>
        <span className={styles.title}>Weather</span>
      </div>
      <div className={styles.content}>
        <div className={styles.main}>
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className={styles.icon}
          />
          <div className={styles.temp}>{Math.round(weather.main.temp)}°C</div>
        </div>
        <div className={styles.location}>{weather.name}</div>
        <div className={styles.description}>
          {weather.weather[0].description}
        </div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Feels like</span>
            <span className={styles.detailValue}>
              {Math.round(weather.main.feels_like)}°C
            </span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Humidity</span>
            <span className={styles.detailValue}>{weather.main.humidity}%</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Wind</span>
            <span className={styles.detailValue}>
              {Math.round(weather.wind.speed)} m/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
