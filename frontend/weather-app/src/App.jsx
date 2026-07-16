import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Footer from './components/Footer';
import Clock from './components/Clock';
import { getWeather, getWeatherByCoords } from './services/weatherApi';
import './App.css'; // For the top-bar and theme toggle button

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchWeather = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeather(query);
      setWeatherData(data);
    } catch (err) {
      console.error("Failed to fetch weather:", err.message);
      setError(err.message || 'Something went wrong while fetching the weather.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setError(null);
          const data = await getWeatherByCoords(
            position.coords.latitude, 
            position.coords.longitude
          );
          setWeatherData(data);
        } catch (err) {
          console.error("Geolocation fetch failed:", err);
          setError('Failed to get weather for your location. Please check your browser permissions.');
          setWeatherData(null);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location. Check browser permissions.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    handleLocation();
  }, []);

  return (
    <div className="container">
      <div className="top-bar">
        <h1 className="app-logo">WeatherApp</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock timezone={weatherData?.current?.timezone} />
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <header>
        <SearchBar onSearch={fetchWeather} onLocation={handleLocation} />
      </header>

      <main className="main-content">
        {error && (
          <div className="glass-panel error-banner animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="glass-panel loading-banner animate-fade-in">
            <p className="text-secondary">Gathering weather data...</p>
          </div>
        ) : weatherData ? (
          <>
            <CurrentWeather data={weatherData.current} />
            <Forecast data={weatherData.forecast} />
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default App;
