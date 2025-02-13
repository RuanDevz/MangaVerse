import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchManga, getCoverImage } from '../services/api';
import type { Manga } from '../types/manga';

export function SearchBar() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Manga[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSearch = React.useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchManga(value);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, handleSearch]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga..."
          className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:border-indigo-600"
        />
      </div>

      {query && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((manga) => {
                const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
                const coverFilename = coverArt?.attributes?.fileName;
                const coverUrl = coverFilename ? getCoverImage(manga.id, coverFilename) : null;
                const title = manga.attributes.title.en || 
                  manga.attributes.title.ja || 
                  Object.values(manga.attributes.title)[0] || 
                  'Unknown Title';

                return (
                  <button
                    key={manga.id}
                    onClick={() => {
                      navigate(`/manga/${manga.id}`);
                      setQuery('');
                      setResults([]);
                    }}
                    className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">No Cover</span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {manga.attributes.status}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}