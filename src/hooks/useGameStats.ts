import { useQuery } from '@tanstack/react-query';
import { getDemoTeams } from '../lib/teams';
import { demoUsers } from '../lib/demo-data';

export function useGameStats(gameId: string | undefined) {
  const isDemoMode = import.meta.env.MODE === 'development';

  const { data: userCount } = useQuery({
    queryKey: ['game-users-count', gameId],
    queryFn: async () => {
      if (isDemoMode) {
        return demoUsers.filter(user => 
          user.gamesPlayed.some(game => game.id === gameId)
        ).length;
      }
      return 0;
    },
    enabled: Boolean(gameId)
  });

  const { data: teamCount } = useQuery({
    queryKey: ['game-teams-count', gameId],
    queryFn: async () => {
      if (isDemoMode) {
        const teams = getDemoTeams();
        return teams.filter(team => 
          team.games.some(game => game.id === gameId)
        ).length;
      }
      return 0;
    },
    enabled: Boolean(gameId)
  });

  return {
    userCount: userCount || 0,
    teamCount: teamCount || 0
  };
}