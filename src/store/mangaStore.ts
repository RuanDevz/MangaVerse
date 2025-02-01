import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Manga } from '../types/manga';

interface MangaStore {
  favorites: Manga[];
  addFavorite: (manga: Manga) => void;
  removeFavorite: (mangaId: string) => void;
  isFavorite: (mangaId: string) => boolean;
}

export const useMangaStore = create<MangaStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (manga) => 
        set((state) => ({
          favorites: [...state.favorites, manga],
        })),
      removeFavorite: (mangaId) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== mangaId),
        })),
      isFavorite: (mangaId) =>
        get().favorites.some((manga) => manga.id === mangaId),
    }),
    {
      name: 'manga-storage',
    }
  )
);