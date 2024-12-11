import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import { Circle } from 'lucide-react';

export default function SidebarProfile() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="px-2 py-4 border-b border-gaming-neon/20">
      <Link 
        to={`/profile/${user.id}`}
        className="flex justify-center"
      >
        <div className="relative">
          <img
            src={user.profileImage || 'https://via.placeholder.com/40'}
            alt={user.username}
            className="w-10 h-10 rounded-full border-2 border-gaming-neon/50 hover:border-gaming-neon transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-gaming-card border-2 border-gaming-card">
            <Circle className="w-full h-full text-green-500 fill-current" />
          </div>
        </div>
      </Link>
    </div>
  );
}