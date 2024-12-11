import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { User } from '../../types';
import { getDemoUser } from '../../lib/demo-data';
import OnlineStatus from '../shared/OnlineStatus';

interface FollowersSectionProps {
  user: User;
}

export default function FollowersSection({ user }: FollowersSectionProps) {
  // Get follower details
  const followers = user.followers.map(id => getDemoUser(id)).filter(Boolean) as User[];
  const following = user.following.map(id => getDemoUser(id)).filter(Boolean) as User[];

  return (
    <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-gaming-neon" />
        <h2 className="font-display text-lg font-bold text-white">
          Network
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Followers */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Followers ({followers.length})
          </h3>
          <div className="space-y-2">
            {followers.length === 0 ? (
              <p className="text-sm text-gray-500">No followers yet</p>
            ) : (
              followers.slice(0, 3).map((follower, index) => (
                <Link
                  key={`follower-${follower.id}-${index}`}
                  to={`/profile/${follower.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gaming-dark/50 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={follower.profileImage}
                      alt={follower.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <OnlineStatus userId={follower.id} />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white group-hover:text-gaming-neon transition-colors">
                      {follower.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      {follower.gamerTitle}
                    </div>
                  </div>
                </Link>
              ))
            )}
            {followers.length > 3 && (
              <Link
                to={`/profile/${user.id}/followers`}
                className="block text-center text-sm text-gaming-neon hover:text-gaming-neon/80 transition-colors"
              >
                View all followers
              </Link>
            )}
          </div>
        </div>

        {/* Following */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            Following ({following.length})
          </h3>
          <div className="space-y-2">
            {following.length === 0 ? (
              <p className="text-sm text-gray-500">Not following anyone</p>
            ) : (
              following.slice(0, 3).map((followed, index) => (
                <Link
                  key={`following-${followed.id}-${index}`}
                  to={`/profile/${followed.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gaming-dark/50 transition-colors group"
                >
                  <div className="relative">
                    <img
                      src={followed.profileImage}
                      alt={followed.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <OnlineStatus userId={followed.id} />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white group-hover:text-gaming-neon transition-colors">
                      {followed.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      {followed.gamerTitle}
                    </div>
                  </div>
                </Link>
              ))
            )}
            {following.length > 3 && (
              <Link
                to={`/profile/${user.id}/following`}
                className="block text-center text-sm text-gaming-neon hover:text-gaming-neon/80 transition-colors"
              >
                View all following
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}