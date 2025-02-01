import axios from 'axios';
import type { MangaResponse, ChapterResponse, ChapterPages, Manga } from '../types/manga';

const api = axios.create({
  baseURL: '/api',
});

// Manga endpoints
export const getMangaList = async (params?: { 
  page?: number; 
  limit?: number;
  title?: string;
  authors?: string[];
  artists?: string[];
  year?: number;
  includedTags?: string[];
  excludedTags?: string[];
  status?: string[];
  order?: { [key: string]: 'asc' | 'desc' };
}) => {
  const response = await api.get<MangaResponse>('/manga', {
    params: {
      limit: params?.limit || 20,
      offset: params?.page ? (params.page - 1) * (params?.limit || 20) : 0,
      title: params?.title,
      authors: params?.authors,
      artists: params?.artists,
      year: params?.year,
      includedTags: params?.includedTags,
      excludedTags: params?.excludedTags,
      status: params?.status,
      order: params?.order || { followedCount: 'desc' },
      includes: ['cover_art', 'author', 'artist'],
      contentRating: ['safe', 'suggestive'],
    },
  });
  return response.data;
};

export const searchManga = async (query: string) => {
  const response = await api.get<MangaResponse>('/manga', {
    params: {
      title: query,
      limit: 20,
      includes: ['cover_art'],
      contentRating: ['safe', 'suggestive'],
    },
  });
  return response.data;
};

export const getMangaById = async (id: string) => {
  const response = await api.get<{ data: Manga }>(`/manga/${id}`, {
    params: {
      includes: ['cover_art', 'author', 'artist'],
    },
  });
  return response.data;
};

export const getRandomManga = async () => {
  const response = await api.get<{ data: Manga }>('/manga/random', {
    params: {
      includes: ['cover_art', 'author', 'artist'],
    },
  });
  return response.data;
};

export const getMangaAggregateChapters = async (id: string) => {
  const response = await api.get(`/manga/${id}/aggregate`);
  return response.data;
};

export const getMangaFeed = async (id: string, params?: {
  limit?: number;
  offset?: number;
  translatedLanguage?: string[];
  order?: { [key: string]: 'asc' | 'desc' };
}) => {
  const response = await api.get<ChapterResponse>(`/manga/${id}/feed`, {
    params: {
      limit: params?.limit || 100,
      offset: params?.offset || 0,
      translatedLanguage: params?.translatedLanguage || ['en'],
      order: params?.order || { chapter: 'desc' },
      includes: ['scanlation_group'],
    },
  });
  return response.data;
};

// Chapter endpoints
export const getMangaChapters = async (mangaId: string, params?: { 
  limit?: number; 
  offset?: number;
  translatedLanguage?: string[];
  order?: { [key: string]: 'asc' | 'desc' };
}) => {
  const response = await api.get<ChapterResponse>('/chapter', {
    params: {
      manga: mangaId,
      limit: params?.limit || 100,
      offset: params?.offset || 0,
      translatedLanguage: params?.translatedLanguage || ['en'],
      order: params?.order || { chapter: 'desc' },
      includes: ['scanlation_group'],
    },
  });
  return response.data;
};

export const getChapterPages = async (chapterId: string) => {
  const response = await api.get<ChapterPages>(`/at-home/server/${chapterId}`);
  return response.data;
};

// Author endpoints
export const getAuthorList = async (params?: {
  limit?: number;
  offset?: number;
  name?: string;
  order?: { [key: string]: 'asc' | 'desc' };
}) => {
  const response = await api.get('/author', {
    params: {
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      name: params?.name,
      order: params?.order,
    },
  });
  return response.data;
};

export const getAuthorById = async (id: string) => {
  const response = await api.get(`/author/${id}`);
  return response.data;
};

// Cover endpoints
export const getCoverList = async (params?: {
  limit?: number;
  offset?: number;
  manga?: string[];
  order?: { [key: string]: 'asc' | 'desc' };
}) => {
  const response = await api.get('/cover', {
    params: {
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      manga: params?.manga,
      order: params?.order,
    },
  });
  return response.data;
};

export const getCoverImage = (mangaId: string, filename: string) => {
  return `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;
};

// Scanlation Group endpoints
export const getScanlationGroupList = async (params?: {
  limit?: number;
  offset?: number;
  name?: string;
  order?: { [key: string]: 'asc' | 'desc' };
}) => {
  const response = await api.get('/group', {
    params: {
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      name: params?.name,
      order: params?.order,
    },
  });
  return response.data;
};

export const getScanlationGroupById = async (id: string) => {
  const response = await api.get(`/group/${id}`);
  return response.data;
};

// Statistics endpoints
export const getMangaStatistics = async (mangaId: string) => {
  const response = await api.get(`/statistics/manga/${mangaId}`);
  return response.data;
};

export const getChapterStatistics = async (chapterId: string) => {
  const response = await api.get(`/statistics/chapter/${chapterId}`);
  return response.data;
};

// Tag endpoints
export const getMangaTags = async () => {
  const response = await api.get('/manga/tag');
  return response.data;
};

// Reading status endpoints
export const getMangaReadingStatus = async (mangaId: string) => {
  const response = await api.get(`/manga/${mangaId}/status`);
  return response.data;
};

export const updateMangaReadingStatus = async (mangaId: string, status: string) => {
  const response = await api.post(`/manga/${mangaId}/status`, { status });
  return response.data;
};

// Read markers
export const getMangaReadMarkers = async (mangaId: string) => {
  const response = await api.get(`/manga/${mangaId}/read`);
  return response.data;
};

export const updateMangaReadMarkers = async (mangaId: string, chapterIds: string[]) => {
  const response = await api.post(`/manga/${mangaId}/read`, { chapterIds });
  return response.data;
};

// User reading history
export const getUserReadingHistory = async (params?: {
  limit?: number;
  offset?: number;
}) => {
  const response = await api.get('/user/history', {
    params: {
      limit: params?.limit || 20,
      offset: params?.offset || 0,
    },
  });
  return response.data;
};