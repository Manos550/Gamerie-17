import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Team } from '../../types';
import { getDemoUser } from '../../lib/demo-data';
import OnlineStatus from '../shared/OnlineStatus';

interface TeamFollowersListProps {
  team: Team;
}

export default function TeamFollowersList({ team }: TeamFollowersListProps) {
  // Get follower details
  const followers = team.followers.map(id => getDemoUser(id)).filter(Boolean);

  return (
    <div className="bg-gaming-card rounded-lg p-6 border border-gaming-neon/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Followers</h2>
        </div>
        <span className="text-sm text-gray-400">{team.followers.length} total</span>
      </div>

      <div className="space-y-4">
        {followers.length === 0 ? (
          <p className="text-center py-4 text-gray-400">No followers yet</p>
        ) : (
          followers.map((follower) => (
            <Link
              key={follower.id}
              to={`/profile/${follower.id}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-gaming-dark/50 hover:bg-gaming-dark transition-colors group"
            >
              <div className="relative">
                <img
                  src={follower.profileImage}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute -bottom-1 -right-1">
                  <OnlineStatus userId={follower.id} />
                </div>
              </div>
              <div>
                <div className="text-white group-hover:text-gaming-neon transition-colors">
                  {follower.username}
                </div>
                <div className="text-sm text-gray-400">
                  {follower.gamerTitle}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}