import React from 'react';
import { getMangaList } from '../services/api';
import { MangaCard } from '../components/MangaCard';
import type { Manga } from '../types/manga';

export function Home() {
  // Estados para Trending e New Releases (chamadas únicas)
  const [trending, setTrending] = React.useState<Manga[]>([]);
  const [newReleases, setNewReleases] = React.useState<Manga[]>([]);
  
  // Estados para a seção Popular com carregamento infinito
  const [popular, setPopular] = React.useState<Manga[]>([]);
  const [popularOffset, setPopularOffset] = React.useState(0);
  const [popularHasMore, setPopularHasMore] = React.useState(true);
  const [loadingPopular, setLoadingPopular] = React.useState(false);

  // Estados gerais de carregamento e erro
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Carrega Trending Anime e New Releases de forma única (limite fixo)
  React.useEffect(() => {
    const fetchTrendingAndNewReleases = async () => {
      try {
        const [trendingResponse, newReleasesResponse] = await Promise.all([
          getMangaList({ order: { followedCount: 'desc' }, limit: 10 }),
          getMangaList({ order: { latestUploadedChapter: 'desc' }, limit: 10 }),
        ]);

        if (trendingResponse.result === 'ok' && Array.isArray(trendingResponse.data)) {
          setTrending(trendingResponse.data);
        } else {
          setError('Failed to load trending anime');
        }

        if (newReleasesResponse.result === 'ok' && Array.isArray(newReleasesResponse.data)) {
          setNewReleases(newReleasesResponse.data);
        } else {
          setError('Failed to load new releases');
        }
      } catch (err) {
        console.error('Error fetching manga:', err);
        setError('Failed to load manga list');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingAndNewReleases();
  }, []);

  // Função para carregar mais itens na seção Popular
  const loadMorePopular = async () => {
    setLoadingPopular(true);
    try {
      const limit = 40;
      const response = await getMangaList({ limit, offset: popularOffset });
      if (response.result === 'ok' && Array.isArray(response.data)) {
        setPopular(prev => [...prev, ...response.data]);
        setPopularOffset(prev => prev + response.data.length);
        // Se o número de itens retornados for menor que o limite, não há mais itens
        if (response.data.length < limit) {
          setPopularHasMore(false);
        }
      } else {
        setError('Failed to load popular manga');
      }
    } catch (err) {
      console.error('Error loading popular manga:', err);
      setError('Failed to load popular manga');
    } finally {
      setLoadingPopular(false);
    }
  };

  // Carrega a primeira página dos populares ao montar o componente
  React.useEffect(() => {
    loadMorePopular();
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
    <div className="container mx-auto px-4 py-24 space-y-12">
      {/* Seção Trending Anime */}
      <section>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Trending Anime</h1>
        {trending.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {trending.map((manga) => (
              <div key={manga.id} className="flex-none w-64">
                <MangaCard manga={manga} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No trending anime found
          </p>
        )}
      </section>

      {/* Seção New Releases */}
      <section>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">New Releases</h1>
        {newReleases.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {newReleases.map((manga) => (
              <div key={manga.id} className="flex-none w-64">
                <MangaCard manga={manga} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No new releases found
          </p>
        )}
      </section>

      {/* Seção Popular Manga */}
      <section>
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Popular Manga</h1>
        {popular.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {popular.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
            {popularHasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMorePopular}
                  disabled={loadingPopular}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loadingPopular ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No manga found
          </p>
        )}
      </section>
    </div>
  );
}
