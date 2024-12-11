import React from 'react';
import { Trophy, Star, Shield, Target, Crown } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export default function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="w-4 h-4" />;
      case 'skill':
        return <Target className="w-4 h-4" />;
      case 'rank':
        return <Crown className="w-4 h-4" />;
      case 'special':
        return <Star className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {achievements.slice(0, 5).map((achievement) => (
        <div
          key={achievement.id}
          className="p-1 rounded-full bg-gaming-dark/50 text-gaming-neon"
          title={achievement.title}
        >
          {getAchievementIcon(achievement.type)}
        </div>
      ))}
      {achievements.length > 5 && (
        <div className="p-1 rounded-full bg-gaming-dark/50 text-gaming-neon">
          <span className="text-xs">+{achievements.length - 5}</span>
        </div>
      )}
    </div>
  );
}