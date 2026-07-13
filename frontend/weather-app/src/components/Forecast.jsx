import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, CloudHail, HelpCircle } from 'lucide-react';
import './Forecast.css';

const ForecastIcon = ({ condition }) => {
  const iconProps = { size: 32, className: 'forecast-icon' };
  switch (condition) {
    case 'Clear Day': return <Sun {...iconProps} color="#fbbf24" />;
    case 'Clear Night': return <Moon {...iconProps} color="#94a3b8" />;
    case 'Partly Cloudy': return <CloudSun {...iconProps} color="#fbbf24" />;
    case 'Partly Cloudy Night': return <CloudMoon {...iconProps} color="#94a3b8" />;
    case 'Overcast': case 'Cloudy': return <Cloud {...iconProps} color="#94a3b8" />;
    case 'Fog': return <CloudFog {...iconProps} color="#94a3b8" />;
    case 'Drizzle': return <CloudDrizzle {...iconProps} color="#60a5fa" />;
    case 'Rain': return <CloudRain {...iconProps} color="#3b82f6" />;
    case 'Heavy Rain': return <CloudRain {...iconProps} color="#1d4ed8" />;
    case 'Freezing Rain': return <CloudHail {...iconProps} color="#60a5fa" />;
    case 'Snow': case 'Snow Showers': return <CloudSnow {...iconProps} color="#e2e8f0" />;
    case 'Thunderstorm': return <CloudLightning {...iconProps} color="#818cf8" />;
    default: return <HelpCircle {...iconProps} color="#94a3b8" />;
  }
};

export default function Forecast({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-panel forecast-container animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {data.map((day) => (
          <div key={day.id} className="forecast-item">
            <span className="day-name">{day.day}</span>
            <div className="forecast-icon-wrapper">
               <ForecastIcon condition={day.condition} />
            </div>
            <span className="day-condition text-secondary">{day.condition}</span>
            <div className="day-temps">
              <span className="temp-max">{day.tempMax}°</span>
              <span className="temp-min text-secondary">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
