import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFeedPosts } from '../../lib/posts';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import { useAuthStore } from '../../lib/store';

export default function NewsFeed() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['feed', filter],
    queryFn: getFeedPosts,
    // Refetch every 5 seconds
    refetchInterval: 5000,
    // Enable real-time updates
    refetchOnWindowFocus: true,
    // Prevent unnecessary background refetches
    staleTime: 1000,
    // Keep previous data while fetching
    keepPreviousData: true
  });

  // Prefetch next data
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['feed', filter],
      queryFn: getFeedPosts
    });
  }, [queryClient, filter]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {user && <CreatePost />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-bold text-white">News Feed</h2>
        <div className="inline-flex items-center bg-gaming-dark rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-gaming-neon text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter('following')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              filter === 'following'
                ? 'bg-gaming-neon text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {posts?.length === 0 ? (
          <div className="bg-gaming-card rounded-lg p-8 text-center">
            <p className="text-gray-400">No posts yet</p>
          </div>
        ) : (
          posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}