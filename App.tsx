import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, Heart, LogOut, Plus, RefreshCw, Star, Trash2 } from 'lucide-react';

// Services & Types
import { loginUser, getUser, logoutUser, toggleFavorite, getFavorites } from './services/storageService';
import { generateAustralianJoke } from './services/geminiService';
import { User, JokeData, AppView, THEME } from './types';

// Components
import Login from './components/Login';
import JokeCard from './components/JokeCard';
import Button from './components/Button';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [currentJoke, setCurrentJoke] = useState<JokeData | null>(null);
  const [favorites, setFavorites] = useState<JokeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for image generation
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize Session
  useEffect(() => {
    const session = getUser();
    if (session) {
      setUser(session);
      setCurrentView(AppView.JOKES);
      fetchFavorites();
    }
  }, []);

  const fetchFavorites = () => {
    setFavorites(getFavorites());
  };

  const handleLogin = (username: string) => {
    const loggedUser = loginUser(username);
    setUser(loggedUser);
    setCurrentView(AppView.JOKES);
    fetchFavorites();
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView(AppView.LOGIN);
    setCurrentJoke(null);
  };

  const fetchNewJoke = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const joke = await generateAustralianJoke();
      setCurrentJoke(joke);
    } catch (err) {
      setError("Failed to fetch a joke. The emus might have chewed the cables.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a joke on first load of jokes view if none exists
  useEffect(() => {
    if (currentView === AppView.JOKES && !currentJoke && !loading) {
      fetchNewJoke();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  const handleToggleFavorite = () => {
    if (!currentJoke || !user) return;
    const updatedUser = toggleFavorite(currentJoke);
    setUser(updatedUser);
    fetchFavorites();
  };

  const handleDeleteFavorite = (joke: JokeData) => {
    if (!user) return;
    const updatedUser = toggleFavorite(joke); // Toggling an existing fav removes it
    setUser(updatedUser);
    fetchFavorites();
  };

  const handleDownloadImage = async () => {
    if (cardRef.current === null) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true, backgroundColor: '#F7F7F5', style: { margin: '0' } });
      const link = document.createElement('a');
      link.download = `aussie-joke-${currentJoke?.id || Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Could not generate image. Sorry mate!');
    }
  };

  // --- Render Helpers ---

  const renderHeader = () => (
    <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-6 px-4">
      <div className="flex items-center gap-2">
        <div className="bg-[#FFBC42] w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold text-sm">
          AJ
        </div>
        <span className="font-bold text-lg tracking-tight">Aussie Joke Mate</span>
      </div>
      
      {user && (
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentView(AppView.JOKES)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors border-2 ${currentView === AppView.JOKES ? 'bg-[#00CFFF] border-black' : 'border-transparent hover:bg-gray-200'}`}
          >
            Daily Joke
          </button>
          <button 
            onClick={() => setCurrentView(AppView.FAVORITES)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors border-2 ${currentView === AppView.FAVORITES ? 'bg-[#FFA9A3] border-black' : 'border-transparent hover:bg-gray-200'}`}
          >
            Saved ({favorites.length})
          </button>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      )}
    </header>
  );

  if (!user || currentView === AppView.LOGIN) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
        {renderHeader()}
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-12">
      {renderHeader()}

      <main className="max-w-4xl mx-auto px-4 mt-4">
        
        {currentView === AppView.JOKES && (
          <div className="flex flex-col items-center gap-8">
            
            {/* Controls */}
            <div className="w-full flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold">Today's Pick</h2>
              <div className="flex gap-2">
                 <Button onClick={fetchNewJoke} disabled={loading} variant="secondary" className="flex items-center gap-2 text-sm">
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Brewing...' : 'New Joke'}
                 </Button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 w-full text-center">
                {error}
              </div>
            )}

            {/* Joke Display */}
            {!loading && currentJoke ? (
              <div className="w-full flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* The card to be captured */}
                <div className="w-full flex justify-center">
                     <JokeCard ref={cardRef} joke={currentJoke} />
                </div>

                {/* Actions Bar */}
                <div className="flex gap-4 sticky bottom-6 bg-[#1D201F]/90 backdrop-blur text-white p-3 rounded-full shadow-xl z-50">
                   <button 
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-full transition-all hover:scale-110 ${user.favorites.includes(currentJoke.id) ? 'bg-[#FFA9A3] text-[#1D201F]' : 'bg-white/10 hover:bg-white/20'}`}
                    title="Save to Favorites"
                   >
                     <Heart size={24} fill={user.favorites.includes(currentJoke.id) ? "currentColor" : "none"} />
                   </button>

                   <div className="w-px bg-white/20 mx-1"></div>

                   <button 
                    onClick={handleDownloadImage}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110"
                    title="Download Image"
                   >
                     <Download size={24} />
                   </button>
                </div>

              </div>
            ) : (
                // Loading Skeleton
                loading && (
                    <div className="w-full max-w-2xl bg-white p-8 rounded-xl border-2 border-gray-100 h-96 flex flex-col items-center justify-center gap-4 text-gray-400">
                        <div className="animate-bounce text-4xl">🦘</div>
                        <p>Hop on, fetching a classic for ya...</p>
                    </div>
                )
            )}
          </div>
        )}

        {currentView === AppView.FAVORITES && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-4">
                <Star className="text-[#FFBC42] fill-current" />
                <h2 className="text-2xl font-bold">Your Stash</h2>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No jokes stashed away yet, mate.</p>
                    <Button onClick={() => setCurrentView(AppView.JOKES)} variant="primary">
                        Find some laughs
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map(fav => (
                        <div key={fav.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00CFFF] mb-2 block">{fav.category}</span>
                            <p className="font-medium text-lg mb-2">{fav.content}</p>
                            <p className="italic text-gray-500 mb-4">{fav.punchline}</p>
                            
                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    {new Date(fav.createdAt).toLocaleDateString()}
                                </span>
                                <button 
                                    onClick={() => handleDeleteFavorite(fav)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    title="Remove from favorites"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;