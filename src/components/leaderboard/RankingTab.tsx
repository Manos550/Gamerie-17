import React from 'react';
import { Link } from 'react-router-dom';
import { Medal, Star } from 'lucide-react';

export default function RankingTab({ entities, entityType }: { entities: any[]; entityType: 'users' | 'teams' }) {
  // Calculate ranking score based on multiple factors
  const calculateRankingScore = (entity: any) => {
    const winRate = (entity.stats.wins / (entity.stats.matchesPlayed || 1)) * 100;
    const tournamentBonus = entity.stats.tournamentWins * 100;
    const matchesBonus = entity.stats.matchesPlayed * 5;
    
    return winRate + tournamentBonus + matchesBonus;
  };

  const sortedEntities = [...entities].sort((a, b) => {
    return calculateRankingScore(b) - calculateRankingScore(a);
  });

  const getRankTier = (score: number) => {
    if (score >= 1000) return { name: 'Elite', color: 'text-yellow-400' };
    if (score >= 750) return { name: 'Diamond', color: 'text-blue-400' };
    if (score >= 500) return { name: 'Platinum', color: 'text-purple-400' };
    if (score >= 250) return { name: 'Gold', color: 'text-amber-400' };
    if (score >= 100) return { name: 'Silver', color: 'text-gray-400' };
    return { name: 'Bronze', color: 'text-amber-600' };
  };

  return (
    <div className="space-y-4">
      {sortedEntities.map((entity, index) => {
        const rankingScore = calculateRankingScore(entity);
        const tier = getRankTier(rankingScore);

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

              {/* Ranking Stats */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Star className={`w-5 h-5 ${tier.color}`} />
                  <span className={`text-lg font-bold ${tier.color}`}>{tier.name}</span>
                </div>
                <div className="text-2xl font-bold text-white">{Math.round(rankingScore)}</div>
                <div className="text-sm text-gray-400">Ranking Points</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gaming-neon/10">
              <div className="text-center">
                <div className="text-sm font-medium text-white">{entity.stats.wins}</div>
                <div className="text-xs text-gray-400">Total Wins</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-white">
                  {Math.round((entity.stats.wins / (entity.stats.matchesPlayed || 1)) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-white">{entity.stats.tournamentWins}</div>
                <div className="text-xs text-gray-400">Tournament Wins</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}