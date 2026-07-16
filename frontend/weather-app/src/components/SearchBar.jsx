import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchLocations } from '../services/weatherApi';
import './SearchBar.css';

export default function SearchBar({ onSearch, onLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setHighlightedIndex(-1);
        return;
      }
      const results = await searchLocations(query);
      setSuggestions(results);
      setHighlightedIndex(-1);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      handleSelectSuggestion(suggestions[highlightedIndex]);
    } else if (query.trim()) {
      setShowDropdown(false);
      setHighlightedIndex(-1);
      if (selectedSuggestion && query === selectedSuggestion.name) {
        onSearch(selectedSuggestion);
      } else {
        onSearch(query);
      }
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setSelectedSuggestion(suggestion);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    onSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
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
              setSelectedSuggestion(null);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-expanded={showDropdown && suggestions.length > 0}
            aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
            role="combobox"
          />
          
          {showDropdown && suggestions.length > 0 && (
            <ul className="suggestions-dropdown animate-fade-in" role="listbox">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={suggestion.id}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={index === highlightedIndex ? 'highlighted' : ''}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
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
            setHighlightedIndex(-1);
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
