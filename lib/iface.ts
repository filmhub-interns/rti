export type SearchResults = {score: number, show: Show}[]

export interface Show {
  id: number;
  name: string;
  genres: string[];
  language: string;
  image: {
    medium: string;
  };
  summary: string;
  network?: {
    name: string;
    country: {
      code: string;
    };
  };
  premiered: string;
  ended: string;
}

export interface Episode {
  name: string;
  seasons: number;
  number: number;
  airdate: string;
  summary: string;
  image: {
    medium: string;
  };
}
