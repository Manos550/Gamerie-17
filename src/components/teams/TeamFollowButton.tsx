import React, { useState } from 'react';
import { useAuthStore } from '../../lib/store';
import { UserPlus, UserMinus } from 'lucide-react';
import { followTeam, unfollowTeam } from '../../lib/follow';
import { useQueryClient } from '@tanstack/react-query';

interface TeamFollowButtonProps {
  teamId: string;
  followers: string[];
  onFollowChange?: () => void;
}

export default function TeamFollowButton({ teamId, followers, onFollowChange }: TeamFollowButtonProps) {
  const { user } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(() => user ? followers.includes(user.id) : false);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleFollow = async () => {
    if (!user || isPending) return;

    setIsPending(true);
    try {
      if (isFollowing) {
        await unfollowTeam(teamId);
      } else {
        await followTeam(teamId);
      }
      
      // Update local state
      setIsFollowing(!isFollowing);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      onFollowChange?.();
    } finally {
      setIsPending(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
        isFollowing
          ? 'bg-gaming-dark border border-gaming-neon text-gaming-neon hover:bg-gaming-neon hover:text-black'
          : 'bg-gaming-neon text-black hover:bg-gaming-neon/90'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-3.5 h-3.5" />
          <span>{isPending ? 'Unfollowing...' : 'Following'}</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isPending ? 'Following...' : 'Follow'}</span>
        </>
      )}
      <span className="text-xs ml-1">({followers.length})</span>
    </button>
  );
}