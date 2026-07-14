import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchLocations } from '../services/weatherApi';
import './SearchBar.css';

export default function SearchBar({ onSearch, onLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const results = await searchLocations(query);
      setSuggestions(results);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      onSearch(query);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setShowDropdown(false);
    onSearch(suggestion);
  };

  return (
    <div className="search-bar-container" ref={wrapperRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <Search className="icon search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search city..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          
          {showDropdown && suggestions.length > 0 && (
            <ul className="suggestions-dropdown animate-fade-in">
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.id} 
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <MapPin size={16} className="text-secondary" />
                  <span>{suggestion.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="btn-primary">Search</button>
        <button 
          type="button" 
          className="btn-icon" 
          onClick={() => {
            setShowDropdown(false);
            onLocation();
          }}
          title="Use my current location"
        >
          <MapPin size={20} />
        </button>
      </form>
    </div>
  );
}
