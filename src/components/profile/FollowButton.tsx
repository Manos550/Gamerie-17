import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../lib/store';
import { followUser, unfollowUser } from '../../lib/follow';
import { UserPlus, UserMinus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  onFollowChange?: () => void;
}

export default function FollowButton({ targetUserId, isFollowing: initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const { user } = useAuthStore();
  const [isPending, setIsPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const queryClient = useQueryClient();

  // Update local state when prop changes
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!user || user.id === targetUserId || isPending) return;

    setIsPending(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
      
      // Update local state
      setIsFollowing(!isFollowing);
      
      // Update cache for both users
      queryClient.setQueryData(['profile', targetUserId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          followers: isFollowing 
            ? oldData.followers.filter((id: string) => id !== user.id)
            : [...oldData.followers, user.id]
        };
      });

      queryClient.setQueryData(['profile', user.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          following: isFollowing
            ? oldData.following.filter((id: string) => id !== targetUserId)
            : [...oldData.following, targetUserId]
        };
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      onFollowChange?.();
    } finally {
      setIsPending(false);
    }
  };

  if (!user || user.id === targetUserId) return null;

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
    </button>
  );
}