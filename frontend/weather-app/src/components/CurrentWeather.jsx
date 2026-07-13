import { Droplets, Wind, MapPin, Thermometer, Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, CloudHail, HelpCircle } from 'lucide-react';
import './CurrentWeather.css';

const ConditionIcon = ({ condition }) => {
  const iconProps = { size: 64, className: 'main-icon' };
  switch (condition) {
    case 'Clear Day': return <Sun {...iconProps} color="#fbbf24" />;
    case 'Clear Night': return <Moon {...iconProps} color="#94a3b8" />;
    case 'Partly Cloudy': return <CloudSun {...iconProps} color="#fbbf24" />;
    case 'Partly Cloudy Night': return <CloudMoon {...iconProps} color="#94a3b8" />;
    case 'Overcast': case 'Cloudy': return <Cloud {...iconProps} color="#94a3b8" />;
    case 'Fog': return <CloudFog {...iconProps} color="#94a3b8" />;
    case 'Drizzle': return <CloudDrizzle {...iconProps} color="#60a5fa" />;
    case 'Rain': return <CloudRain {...iconProps} color="#3b82f6" />;
    case 'Heavy Rain': return <CloudRain {...iconProps} color="#1d4ed8" className="main-icon heavy-rain" />;
    case 'Freezing Rain': return <CloudHail {...iconProps} color="#60a5fa" />;
    case 'Snow': case 'Snow Showers': return <CloudSnow {...iconProps} color="#e2e8f0" />;
    case 'Thunderstorm': return <CloudLightning {...iconProps} color="#818cf8" className="main-icon storm" />;
    default: return <HelpCircle {...iconProps} color="#94a3b8" />;
  }
};

export default function CurrentWeather({ data }) {
  if (!data) return null;

  // Derive animation class from condition
  const animClass = data.condition.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`glass-panel weather-card animate-fade-in has-bg-anim`}>
      <div className={`weather-bg-animation ${animClass}`}></div>
      
      <div className="weather-content-wrapper">
        <div className="weather-header">
          <h2 className="location">
            <MapPin size={24} className="accent-icon" />
            {data.location}
          </h2>
          <span className="condition">{data.condition}</span>
        </div>

        <div className="weather-main">
          <div className="weather-icon-container">
             <ConditionIcon condition={data.condition} />
          </div>
          <div className="temp-display">
            <span className="temperature">{data.temperature}°</span>
            <span className="unit">C</span>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <Thermometer size={20} className="text-secondary" />
            <div className="detail-info">
              <span className="label text-secondary">Feels Like</span>
              <span className="value">{data.feelsLike}°C</span>
            </div>
          </div>
          <div className="detail-item">
            <Droplets size={20} className="text-secondary" />
            <div className="detail-info">
              <span className="label text-secondary">Humidity</span>
              <span className="value">{data.humidity}%</span>
            </div>
          </div>
          <div className="detail-item">
            <Wind size={20} className="text-secondary" />
            <div className="detail-info">
              <span className="label text-secondary">Wind</span>
              <span className="value">{data.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
