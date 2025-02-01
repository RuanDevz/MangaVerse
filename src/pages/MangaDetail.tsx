import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MousePointer } from 'lucide-react';
import { getMangaById, getMangaChapters, getChapterPages, getCoverImage } from '../services/api';
import type { Manga, Chapter } from '../types/manga';
import { cn } from '../lib/utils';

export function MangaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manga, setManga] = React.useState<Manga | null>(null);
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = React.useState<Chapter | null>(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingChapter, setLoadingChapter] = React.useState(false);
  const [showScrollHint, setShowScrollHint] = React.useState(true);
  const readerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchManga = async () => {
      if (!id) return;
      try {
        const mangaResponse = await getMangaById(id);
        setManga(mangaResponse.data);
        
        const chaptersResponse = await getMangaChapters(id);
        setChapters(chaptersResponse.data);
      } catch (error) {
        console.error('Error fetching manga:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [id]);

  const loadChapter = async (chapter: Chapter) => {
    setLoadingChapter(true);
    try {
      const response = await getChapterPages(chapter.id);
      const pageUrls = response.chapter.data.map(
        page => `${response.baseUrl}/data/${response.chapter.hash}/${page}`
      );
      setPages(pageUrls);
      setSelectedChapter(chapter);
      if (readerRef.current) {
        readerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoadingChapter(false);
    }
  };

  const handleNextChapter = () => {
    if (!selectedChapter) return;
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex > 0) {
      loadChapter(chapters[currentIndex - 1]);
    }
  };

  const handlePreviousChapter = () => {
    if (!selectedChapter) return;
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex < chapters.length - 1) {
      loadChapter(chapters[currentIndex + 1]);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p className="text-center text-gray-600 dark:text-gray-300">
          Manga not found
        </p>
      </div>
    );
  }

  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
  const coverFilename = coverArt?.attributes?.fileName;
  const coverUrl = coverFilename ? getCoverImage(manga.id, coverFilename) : null;

  const title = manga.attributes.title.en || 
    manga.attributes.title.ja || 
    Object.values(manga.attributes.title)[0] || 
    'Unknown Title';

  return (
    <div className="container mx-auto px-4 py-24">
      {!selectedChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 dark:text-white">
          <div className="md:col-span-1">
            {coverUrl && (
              <img
                src={coverUrl}
                alt={title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">
              {title}
            </h1>
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p>{manga.attributes.description.en}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h3>
                <p className="mt-1 text-lg font-medium dark:text-white capitalize">
                  {manga.attributes.status}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Year
                </h3>
                <p className="mt-1 text-lg font-medium dark:text-white">
                  {manga.attributes.year || 'N/A'}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Chapters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {chapters.map((chapter) => (
                  <button
  key={chapter.id}
  onClick={() => navigate(`/manga/${id}/chapter/${chapter.id}`)} // Navega para a tela de leitura
  className={cn(
    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
    selectedChapter?.id === chapter.id
      ? 'bg-indigo-600 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
  )}
>
  Chapter {chapter.attributes.chapter}
</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Scroll Hint */}
          {showScrollHint && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/75 text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <MousePointer className="w-4 h-4" />
              <span className="text-sm">Scroll to read</span>
            </div>
          )}

          {/* Reader */}
          <div className="flex items-center justify-center">
            {/* Chapter Navigation - Left */}
            <button
              onClick={handlePreviousChapter}
              disabled={chapters.findIndex(c => c.id === selectedChapter.id) === chapters.length - 1}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 bg-white dark:bg-gray-800 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Chapter Navigation - Right */}
            <button
              onClick={handleNextChapter}
              disabled={chapters.findIndex(c => c.id === selectedChapter.id) === 0}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 bg-white dark:bg-gray-800 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={readerRef}
              className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
            >
              {loadingChapter ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
                </div>
              ) : (
                <div className="space-y-2">
                  {pages.map((page, index) => (
                    <div key={index} className="relative">
                      <img
                        src={page}
                        alt={`Page ${index + 1}`}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}