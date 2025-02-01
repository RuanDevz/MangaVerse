import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useMangaStore } from '../store/mangaStore';
import type { Manga } from '../types/manga';
import { cn } from '../lib/utils';
import { getCoverImage } from '../services/api';

interface MangaCardProps {
  manga: Manga;
}

export function MangaCard({ manga }: MangaCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useMangaStore();
  const favorite = isFavorite(manga.id);

  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
  const coverFilename = coverArt?.attributes?.fileName;
  const coverUrl = coverFilename ? getCoverImage(manga.id, coverFilename) : null;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(manga.id);
    } else {
      addFavorite(manga);
    }
  };

  const title = manga.attributes.title.en || 
    manga.attributes.title.ja || 
    Object.values(manga.attributes.title)[0] || 
    'Unknown Title';

  return (
    <Link
      to={`/manga/${manga.id}`}
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="aspect-[3/4] relative">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Cover</span>
          </div>
        )}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-800"
        >
          <Icons.Heart
            className={cn(
              'w-5 h-5 transition-colors',
              favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            )}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
          {manga.attributes.status}
        </p>
        {manga.attributes.year && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {manga.attributes.year}
          </p>
        )}
      </div>
    </Link>
  );
}