export interface SlangTerm {
  term: string;
  definition: string;
}

export interface VocabularyWord {
  word: string;
  definition: string;
}

export interface JokeData {
  id: string; // generated UUID or timestamp
  content: string;
  punchline: string;
  whyItsFunny: string;
  containsWordplay: boolean;
  containsSlang: boolean;
  slang: SlangTerm[];
  vocabulary: VocabularyWord[]; // Band 7+
  category: string;
  createdAt: number;
}

export interface User {
  username: string;
  favorites: string[]; // Array of Joke IDs
}

export enum AppView {
  LOGIN = 'LOGIN',
  JOKES = 'JOKES',
  FAVORITES = 'FAVORITES'
}

export const THEME = {
  cyan: '#00CFFF',
  pink: '#FFA9A3',
  dark: '#1D201F',
  yellow: '#FFBC42',
  offWhite: '#F7F7F5'
};