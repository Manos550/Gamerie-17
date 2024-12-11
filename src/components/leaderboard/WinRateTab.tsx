import React from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';

export default function WinRateTab({ entities, entityType }: { entities: any[]; entityType: 'users' | 'teams' }) {
  const sortedEntities = [...entities].sort((a, b) => {
    const aWinRate = (a.stats.wins / (a.stats.matchesPlayed || 1)) * 100;
    const bWinRate = (b.stats.wins / (b.stats.matchesPlayed || 1)) * 100;
    return bWinRate - aWinRate;
  });

  return (
    <div className="space-y-4">
      {sortedEntities.map((entity, index) => {
        const winRate = (entity.stats.wins / (entity.stats.matchesPlayed || 1)) * 100;

        return (
          <Link
            key={entity.id}
            to={entityType === 'users' ? `/profile/${entity.id}` : `/teams/${entity.id}`}
            className="block bg-gaming-card rounded-lg p-4 border border-gaming-neon/20 hover:border-gaming-neon transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Rank Medal */}
              <div className="w-12 h-12 rounded-full bg-gaming-dark flex items-center justify-center">
                {index < 3 ? (
                  <Medal className={`w-6 h-6 ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-400' :
                    'text-amber-600'
                  }`} />
                ) : (
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                )}
              </div>

              {/* Entity Info */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={entityType === 'users' ? entity.profileImage : entity.logo}
                  alt={entity.name}
                  className={`w-12 h-12 ${entityType === 'users' ? 'rounded-full' : 'rounded-lg'}`}
                />
                <div>
                  <h3 className="font-bold text-white">{entityType === 'users' ? entity.username : entity.name}</h3>
                  <p className="text-sm text-gaming-neon">
                    {entityType === 'users' ? entity.gamerTitle : entity.level}
                  </p>
                </div>
              </div>

              {/* Win Rate Stats */}
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{Math.round(winRate)}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
                <div className="text-sm text-gray-400">
                  {entity.stats.wins} wins / {entity.stats.matchesPlayed} matches
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}