import React from 'react';
import { Link } from 'react-router-dom';
import { Medal } from 'lucide-react';
import { format } from 'date-fns';

export default function ChallengesTab({ 
  entities, 
  entityType, 
  challenges 
}: { 
  entities: any[]; 
  entityType: 'users' | 'teams';
  challenges: any[];
}) {
  const getEntityChallenges = (entityId: string) => {
    return challenges.filter(c => {
      if (entityType === 'users') {
        return c.type === 'user' && (c.challengerId === entityId || c.challengedId === entityId);
      } else {
        return c.type === 'team' && (c.challengerTeamId === entityId || c.challengedTeamId === entityId);
      }
    });
  };

  const sortedEntities = [...entities].sort((a, b) => {
    const aChallenges = getEntityChallenges(a.id).length;
    const bChallenges = getEntityChallenges(b.id).length;
    return bChallenges - aChallenges;
  });

  return (
    <div className="space-y-4">
      {sortedEntities.map((entity, index) => {
        const entityChallenges = getEntityChallenges(entity.id);
        const rejectedChallenges = entityChallenges.filter(c => c.status === 'rejected');

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

              {/* Challenge Stats */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {entityChallenges.length}
                    <span className="text-sm text-gaming-accent ml-2">
                      ({rejectedChallenges.length} rejected)
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">Total Challenges</div>
                </div>

                {/* Recent Challenges */}
                <div className="space-y-2">
                  {entityChallenges.slice(0, 2).map((challenge) => (
                    <div key={challenge.id} className="text-sm text-gray-400">
                      {challenge.game} - {format(challenge.scheduledDate, 'MMM d')}
                      <span className={`ml-2 ${
                        challenge.status === 'rejected' ? 'text-gaming-accent' :
                        challenge.status === 'completed' ? 'text-gaming-neon' :
                        'text-gray-500'
                      }`}>
                        {challenge.status}
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