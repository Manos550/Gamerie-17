import React from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { format } from 'date-fns';

export default function MatchesTab({ 
  entities, 
  entityType, 
  challenges 
}: { 
  entities: any[]; 
  entityType: 'users' | 'teams';
  challenges: any[];
}) {
  const getEntityMatches = (entityId: string) => {
    return challenges.filter(c => {
      if (entityType === 'users') {
        return c.type === 'user' && (c.challengerId === entityId || c.challengedId === entityId);
      } else {
        return c.type === 'team' && (c.challengerTeamId === entityId || c.challengedTeamId === entityId);
      }
    });
  };

  const sortedEntities = [...entities].sort((a, b) => {
    const aMatches = getEntityMatches(a.id);
    const bMatches = getEntityMatches(b.id);
    const aWins = aMatches.filter(m => m.status === 'completed' && m.result?.winnerId === a.id).length;
    const bWins = bMatches.filter(m => m.status === 'completed' && m.result?.winnerId === b.id).length;
    return bWins - aWins;
  });

  return (
    <div className="space-y-4">
      {sortedEntities.map((entity, index) => {
        const matches = getEntityMatches(entity.id);
        const wonMatches = matches.filter(m => m.status === 'completed' && m.result?.winnerId === entity.id);
        const upcomingMatches = matches.filter(m => 
          m.status === 'pending' && new Date(m.scheduledDate) > new Date()
        );
        const previousMatches = matches.filter(m => 
          m.status === 'completed' || new Date(m.scheduledDate) <= new Date()
        );

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

              {/* Match Stats */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {wonMatches.length}
                    <span className="text-sm text-gaming-neon ml-2">
                      ({upcomingMatches.length}/{previousMatches.length})
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">Matches Won</div>
                </div>

                {/* Recent Matches */}
                <div className="space-y-2">
                  {matches.slice(0, 2).map((match) => (
                    <div key={match.id} className="text-sm text-gray-400">
                      {match.game} - {format(match.scheduledDate, 'MMM d')}
                      <span className={`ml-2 ${
                        match.status === 'completed' && match.result?.winnerId === entity.id
                          ? 'text-gaming-neon'
                          : match.status === 'completed'
                          ? 'text-gaming-accent'
                          : 'text-gray-500'
                      }`}>
                        {match.status === 'completed' 
                          ? match.result?.winnerId === entity.id ? 'Won' : 'Lost'
                          : 'Upcoming'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}