import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMangaChapters, getChapterPages } from '../services/api';
import type { Chapter } from '../types/manga';

export function ChapterReader() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const [pages, setPages] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentChapter, setCurrentChapter] = React.useState<Chapter | null>(null);
  const [chapters, setChapters] = React.useState<Chapter[]>([]);

  // Busca os capítulos e define o capítulo atual
  React.useEffect(() => {
    const fetchChaptersAndCurrentChapter = async () => {
      if (!id || !chapterId) return;
      try {
        // Busca a lista de capítulos
        const chaptersResponse = await getMangaChapters(id);
        setChapters(chaptersResponse.data);

        // Define o capítulo atual
        const current = chaptersResponse.data.find(c => c.id === chapterId);
        setCurrentChapter(current || null);

        // Busca as páginas do capítulo
        const pagesResponse = await getChapterPages(chapterId);
        const pageUrls = pagesResponse.chapter.data.map(
          page => `${pagesResponse.baseUrl}/data/${pagesResponse.chapter.hash}/${page}`
        );
        setPages(pageUrls);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChaptersAndCurrentChapter();
  }, [id, chapterId]);

  const handleNextChapter = () => {
    if (!currentChapter) return;
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex > 0) {
      const nextChapter = chapters[currentIndex - 1];
      navigate(`/manga/${id}/chapter/${nextChapter.id}`);
    }
  };

  const handlePreviousChapter = () => {
    if (!currentChapter) return;
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex < chapters.length - 1) {
      const previousChapter = chapters[currentIndex + 1];
      navigate(`/manga/${id}/chapter/${previousChapter.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Navegação - Esquerda */}
      <button
        onClick={handlePreviousChapter}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Navegação - Direita */}
      <button
        onClick={handleNextChapter}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Páginas do Capítulo */}
      <div className="max-w-4xl mx-auto overflow-y-auto" style={{ maxHeight: '100vh' }}>
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
    </div>
  );
}