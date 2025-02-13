import React from 'react';
import { getMangaById } from '../services/api';
import { MangaCard } from '../components/MangaCard';
import type { Manga } from '../types/manga';

export function Favorites() {
  const [mangas, setMangas] = React.useState<Manga[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Exemplo de IDs favoritos (substitua pelos IDs reais ou a lógica de favoritos da sua aplicação)
  const favoriteIds = ['manga-id-1', 'manga-id-2', 'manga-id-3'];

  React.useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const responses = await Promise.all(favoriteIds.map((id) => getMangaById(id)));
        // Cada resposta possui uma propriedade "data" com os detalhes do mangá
        const favoriteMangas = responses.map((res) => res.data);
        setMangas(favoriteMangas);
      } catch (error) {
        console.error('Error fetching favorite manga:', error);
        setError('Failed to load favorite manga');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
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
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Favorite Manga</h1>
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
