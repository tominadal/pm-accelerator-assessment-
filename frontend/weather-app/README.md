# Weather App Frontend

Frontend implementation for the PM Accelerator AI Engineer Intern Technical Assessment.

## Overview
A React-based weather application that queries real-time weather and 5-day forecasts via Open-Meteo APIs. Built without heavy CSS frameworks to demonstrate core frontend architecture and responsive design patterns.

## Technical Details

### Responsive Architecture
- Implemented fluid layouts utilizing **CSS Grid** (`auto-fit`, `minmax`) to handle forecast card reflows natively without media query bloat.
- Flexbox applied for search and current weather components to manage dynamic wrapping across viewports.
- Responsive typography and spacing using relative units (`rem`, `em`).

### API Integration
The application orchestrates three separate services within the `weatherApi.js` service layer:
1. **Open-Meteo Geocoding:** Resolves text queries to absolute coordinates.
2. **Open-Meteo Forecast:** Fetches current conditions, apparent temperature, and multi-day forecasts.
3. **Nominatim (OSM):** Handles reverse geocoding when utilizing browser-native Geolocation APIs.

Error boundaries and strict fallback chains are implemented to prevent hallucinated location names.

## Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Stack
- React / Vite
- Vanilla CSS (CSS Modules / Custom Properties)
- Lucide React
