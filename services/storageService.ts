import { JokeData, User } from '../types';

const USER_KEY = 'aussie_joke_user';
const JOKES_KEY = 'aussie_joke_library'; // We store full joke objects here to retrieve by ID

export const loginUser = (username: string): User => {
  const existing = localStorage.getItem(USER_KEY);
  if (existing) {
    const user = JSON.parse(existing);
    if (user.username === username) return user;
  }
  
  // New session or new user
  const newUser: User = { username, favorites: [] };
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const getUser = (): User | null => {
  const existing = localStorage.getItem(USER_KEY);
  return existing ? JSON.parse(existing) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const toggleFavorite = (joke: JokeData): User => {
  const user = getUser();
  if (!user) throw new Error("No user logged in");

  const libraryStr = localStorage.getItem(JOKES_KEY);
  let library: Record<string, JokeData> = libraryStr ? JSON.parse(libraryStr) : {};

  // Update library with this joke to ensure we have the data
  library[joke.id] = joke;
  localStorage.setItem(JOKES_KEY, JSON.stringify(library));

  const isFav = user.favorites.includes(joke.id);
  if (isFav) {
    user.favorites = user.favorites.filter(id => id !== joke.id);
  } else {
    user.favorites.push(joke.id);
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const getFavorites = (): JokeData[] => {
  const user = getUser();
  if (!user) return [];
  
  const libraryStr = localStorage.getItem(JOKES_KEY);
  if (!libraryStr) return [];
  
  const library: Record<string, JokeData> = JSON.parse(libraryStr);
  return user.favorites.map(id => library[id]).filter(Boolean);
};