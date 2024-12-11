import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Clock, Activity } from 'lucide-react';
import { GameUser } from '../../types';
import AchievementBadges from './AchievementBadges';
import OnlineStatus from '../shared/OnlineStatus';

interface UserCardProps {
  user: GameUser;
  gameId: string;
}

export default function UserCard({ user, gameId }: UserCardProps) {
  const winRate = ((user.stats.wins / (user.stats.wins + user.stats.losses)) * 100).toFixed(1);

  return (
    <div className="bg-gaming-card rounded-lg border border-gaming-neon/20 hover:border-gaming-neon transition-colors p-4 group">
      <Link to={`/profile/${user.id}`} className="block">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <img
              src={user.profileImage || 'https://via.placeholder.com/40'}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1">
              <OnlineStatus userId={user.id} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-gaming-neon transition-colors">
              {user.username}
            </h3>
            <div className="text-sm text-gaming-neon">{user.currentRank}</div>
          </div>
        </div>

        <div className="space-y-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              <Trophy className="w-4 h-4 text-gaming-neon" />
              <span>{winRate}% WR</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4 text-gaming-neon" />
              <span>{Math.floor(user.playtime / 60)}h</span>
            </div>
          </div>

          {/* Activity Level */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gaming-neon" />
            <div className="flex-1 h-1.5 bg-gaming-dark rounded-full overflow-hidden">
              <div 
                className="h-full bg-gaming-neon transition-all"
                style={{ width: `${user.activityLevel}%` }}
              />
            </div>
          </div>

          {/* Achievement Badges */}
          <AchievementBadges achievements={user.achievements} />

          {/* Last Active */}
          <div className="text-xs text-gray-400">
            Last active {formatDistanceToNow(user.lastActive, { addSuffix: true })}
          </div>
        </div>
      </Link>
    </div>
  );
}