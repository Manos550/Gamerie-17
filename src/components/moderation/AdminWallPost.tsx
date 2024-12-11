import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallPosts } from '../../lib/posts';
import PostCard from '../feed/PostCard';
import CreatePost from '../feed/CreatePost';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import { MessageSquare, History, Calendar, Shield } from 'lucide-react';

export default function AdminWallPost() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['admin-wall-posts'],
    queryFn: () => getWallPosts('admin'),
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
      <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Admin Posts</h2>
        </div>
        <CreatePost />
      </div>

      {/* Posts Display */}
      {posts?.length === 0 ? (
        <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gaming-neon/20 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-white mb-2">No Admin Posts Yet</h3>
          <p className="text-gray-400">
            Share important announcements and updates with the community.
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
                  <h3 className="font-display text-lg font-bold text-white">Recent Announcements</h3>
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
                  <h3 className="font-display text-lg font-bold text-white">Announcement History</h3>
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