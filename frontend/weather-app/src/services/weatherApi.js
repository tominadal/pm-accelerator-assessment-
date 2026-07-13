const getWeatherCondition = (code, isDay = 1) => {
  if (code === 0) return isDay ? 'Clear Day' : 'Clear Night';
  if (code === 1 || code === 2) return isDay ? 'Partly Cloudy' : 'Partly Cloudy Night';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code === 66 || code === 67) return 'Freezing Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Heavy Rain';
  if (code === 85 || code === 86) return 'Snow Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const fetchWeatherData = async (lat, lon, locationName) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data from API.');
  }
  
  const data = await response.json();
  
  const current = {
    location: locationName,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition: getWeatherCondition(data.current.weather_code, data.current.is_day),
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    isDay: data.current.is_day === 1
  };

  const forecast = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 1; i <= 5; i++) {
    const dateObj = new Date(data.daily.time[i]);
    const dayIndex = new Date(dateObj.getTime() + Math.abs(dateObj.getTimezoneOffset() * 60000)).getDay();
    
    forecast.push({
      id: i,
      day: days[dayIndex],
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      condition: getWeatherCondition(data.daily.weather_code[i], 1),
    });
  }

  return { current, forecast };
};

export const getWeather = async (query) => {
  if (!query || query.trim() === '') {
    throw new Error('Please enter a location.');
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
  const geoResponse = await fetch(geoUrl);
  
  if (!geoResponse.ok) {
    throw new Error('Failed to connect to location service.');
  }
  
  const geoData = await geoResponse.json();
  
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error('Location not found. Try entering a more specific city name.');
  }

  const { latitude, longitude, name, admin1, country } = geoData.results[0];
  
  const fullNameParts = [name];
  if (admin1 && admin1 !== name) fullNameParts.push(admin1);
  fullNameParts.push(country);
  
  const fullName = fullNameParts.join(', ');

  return await fetchWeatherData(latitude, longitude, fullName);
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const geoResponse = await fetch(reverseGeoUrl, {
      headers: { 'User-Agent': 'WeatherApp-TechnicalAssessment' }
    });
    const geoData = await geoResponse.json();
    
    const address = geoData.address || {};
    const exactLocation = address.city || address.town || address.village || address.suburb || address.neighbourhood;
    
    let locationName = '';
    if (exactLocation) {
       locationName = address.country ? `${exactLocation}, ${address.country}` : exactLocation;
    } else {
       locationName = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    }
    
    return await fetchWeatherData(lat, lon, locationName);
  } catch (error) {
    console.warn("Reverse geocoding failed, using coordinates:", error);
    return await fetchWeatherData(lat, lon, `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
  }
};
