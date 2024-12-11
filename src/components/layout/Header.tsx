import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/auth';
import { Bell, Search, LogOut, Gamepad, User, UserPlus, Shield } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { search } from '../../lib/search';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../lib/utils';
import NotificationBell from '../notifications/NotificationBell';

export default function Header() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ users: [], teams: [], games: [] });
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Check if user is admin (in demo mode, user-1 is admin)
  const isAdmin = user?.id === 'user-1';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        const results = await search(debouncedSearchTerm);
        setSearchResults(results);
        setShowResults(true);
        setIsSearching(false);
      } else {
        setSearchResults({ users: [], teams: [], games: [] });
        setShowResults(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = searchResults.games.length + searchResults.teams.length + searchResults.users.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      let currentIndex = 0;
      
      // Navigate to games
      for (const game of searchResults.games) {
        if (currentIndex === selectedIndex) {
          navigate(`/games/${game.id}`);
          setShowResults(false);
          setSearchTerm('');
          return;
        }
        currentIndex++;
      }
      
      // Navigate to teams
      for (const team of searchResults.teams) {
        if (currentIndex === selectedIndex) {
          navigate(`/teams/${team.id}`);
          setShowResults(false);
          setSearchTerm('');
          return;
        }
        currentIndex++;
      }
      
      // Navigate to users
      for (const user of searchResults.users) {
        if (currentIndex === selectedIndex) {
          navigate(`/profile/${user.id}`);
          setShowResults(false);
          setSearchTerm('');
          return;
        }
        currentIndex++;
      }
    }
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
      "bg-[#0a192f]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[#0a192f]/80",
      "border-b border-gaming-neon/20",
      isScrolled && "shadow-lg shadow-black/10"
    )}>
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <Gamepad className="w-8 h-8 text-gaming-neon group-hover:animate-glow" />
            <span className="font-display font-bold text-xl text-white group-hover:text-gaming-neon transition-colors">
              GAMERIE
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NotificationBell />
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-gaming-neon transition-colors"
                  title="Admin Panel"
                >
                  <Shield className="w-6 h-6" />
                </Link>
              )}
              <Link 
                to={`/profile/${user.id}`}
                className="hover:ring-2 hover:ring-gaming-neon transition-all"
                title="Profile"
              >
                <img
                  src={user.profileImage || 'https://via.placeholder.com/32'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-gaming-neon/50"
                />
              </Link>
              <button 
                onClick={handleLogout} 
                className="hover:text-gaming-neon transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-gaming-neon transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}