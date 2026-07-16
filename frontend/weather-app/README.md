# Weather App — Frontend

Frontend implementation for the PM Accelerator AI Engineer Intern Technical Assessment.

## Overview
A React-based weather application that queries real-time weather and 5-day forecasts via the Open-Meteo API.
Built without heavy CSS frameworks to demonstrate core frontend architecture and responsive design patterns.

> **No API key required.** This app uses the free [Open-Meteo API](https://open-meteo.com/), which is open-source and does not require registration or authentication. The `.env.example` file is a legacy artifact from an earlier prototype using OpenWeatherMap — it can be safely ignored.

## Features

- **Location search** — accepts city names, region names, and landmarks. Type-ahead autocomplete with up to 5 suggestions (debounced at 300ms). *Note: postal/ZIP codes may have limited resolution depending on the geocoding service.*
- **Current conditions** — temperature (°C), feels-like, humidity (%), wind speed (km/h), condition with icon.
- **5-day forecast** — daily high/low temps with weather icons.
- **GPS location** — browser Geolocation API + Nominatim reverse geocoding.
- **Dark / Light theme** — persisted via localStorage, respects system preference on first load.
- **Error handling** — graceful messages for: city not found, API failure, geolocation denied/unavailable.

## Technical Details

### Responsive Architecture
- CSS Grid (`auto-fit`, `minmax`) for forecast card reflow across breakpoints.
- Flexbox for search bar and weather card layout.
- Responsive typography and spacing with relative units (`rem`, `em`).
- Media queries at 600px for mobile adjustments.

### API Integration (3 services)
1. **Open-Meteo Geocoding** — resolves text queries to GPS coordinates.
2. **Open-Meteo Forecast** — fetches current conditions and 7-day daily forecasts (using days 1–5).
3. **Nominatim (OSM)** — reverse geocoding for GPS-based location lookup.

All API calls include error boundaries and strict fallback chains.

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

## Stack
- React 19 / Vite 8
- Vanilla CSS with CSS Custom Properties (no CSS framework)
- Lucide React (icons)

---
*Built by Tomas Ignacio Nadal* | *Project for PM Accelerator — The Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their careers in product management.*
