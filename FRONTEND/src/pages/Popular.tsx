import React from 'react';
import { getMangaList } from '../services/api';
import { MangaCard } from '../components/MangaCard';
import type { Manga } from '../types/manga';

export function Popular() {
  const [mangas, setMangas] = React.useState<Manga[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await getMangaList({ order: { followedCount: 'desc' } });
        if (response.result === 'ok' && Array.isArray(response.data)) {
          setMangas(response.data);
        } else {
          setError('Failed to load popular manga list');
        }
      } catch (error) {
        console.error('Error fetching popular manga:', error);
        setError('Failed to load popular manga list');
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Popular Manga</h1>
      {mangas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {mangas.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No manga found
        </p>
      )}
    </div>
  );
}
