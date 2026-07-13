import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ onSearch, onLocation }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <Search className="icon search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search city, zip code..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-primary">Search</button>
      <button 
        type="button" 
        className="btn-icon" 
        onClick={onLocation}
        title="Use my current location"
      >
        <MapPin size={20} />
      </button>
    </form>
  );
}
