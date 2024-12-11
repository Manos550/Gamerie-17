import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallPosts } from '../../lib/posts';
import { useAuthStore } from '../../lib/store';
import PostCard from '../feed/PostCard';
import CreatePost from '../feed/CreatePost';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import { MessageSquare, History, Calendar } from 'lucide-react';

interface ProfileWallProps {
  userId: string;
  isOwnProfile: boolean;
}

export default function ProfileWall({ userId, isOwnProfile }: ProfileWallProps) {
  const { user } = useAuthStore();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['wall-posts', userId],
    queryFn: () => getWallPosts(userId),
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  // Separate posts into recent and older
  const recentPosts = posts?.filter(post => {
    const postDate = new Date(post.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return postDate >= thirtyDaysAgo;
  }) || [];

  const olderPosts = posts?.filter(post => {
    const postDate = new Date(post.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return postDate < thirtyDaysAgo;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      {isOwnProfile && <CreatePost />}

      {/* Posts Display */}
      {posts?.length === 0 ? (
        <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gaming-neon/20 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-white mb-2">No Posts Yet</h3>
          <p className="text-gray-400">
            {isOwnProfile 
              ? "Share your gaming moments with the community!"
              : "This user hasn't posted anything yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Recent Posts Section */}
          {recentPosts.length > 0 && (
            <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-gaming-neon" />
                  <h3 className="font-display text-lg font-bold text-white">Recent Posts</h3>
                  <span className="text-sm text-gray-400 ml-2">({recentPosts.length})</span>
                </div>
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Post History Section */}
          {olderPosts.length > 0 && (
            <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <History className="w-5 h-5 text-gaming-neon" />
                  <h3 className="font-display text-lg font-bold text-white">Post History</h3>
                  <span className="text-sm text-gray-400 ml-2">({olderPosts.length})</span>
                </div>
                <div className="space-y-6">
                  {olderPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}