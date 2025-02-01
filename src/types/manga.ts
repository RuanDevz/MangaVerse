export interface MangaResponse {
  result: 'ok' | 'error';
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface Manga {
  id: string;
  type: 'manga';
  attributes: {
    title: {
      en?: string;
      ja?: string;
      [key: string]: string | undefined;
    };
    altTitles: { [key: string]: string }[];
    description: {
      en?: string;
      [key: string]: string | undefined;
    };
    status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
    year: number | null;
    contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
    tags: {
      id: string;
      type: 'tag';
      attributes: {
        name: {
          en: string;
        };
        group: string;
      };
    }[];
    originalLanguage: string;
    lastVolume: string | null;
    lastChapter: string | null;
  };
  relationships: {
    id: string;
    type: 'author' | 'artist' | 'cover_art';
    attributes?: {
      fileName?: string;
    };
  }[];
}

export interface Chapter {
  id: string;
  type: 'chapter';
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    pages: number;
    publishAt: string;
  };
  relationships: {
    id: string;
    type: string;
  }[];
}

export interface ChapterResponse {
  result: 'ok' | 'error';
  data: Chapter[];
}

export interface ChapterPages {
  result: 'ok' | 'error';
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}