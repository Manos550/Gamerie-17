import { useQuery } from '@tanstack/react-query';
import { getChallenges } from '../lib/challenges';
import { getUserEvents } from '../lib/events';
import { useAuthStore } from '../lib/store';
import { Challenge, GameEvent } from '../types';

export function useCalendarEvents() {
  const { user } = useAuthStore();

  // Fetch user's challenges
  const { data: challenges } = useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: () => {
      if (!user) return [];
      // Get both user and team challenges
      const userChallenges = getChallenges('user', user.id);
      const teamChallenges = user.teams.length > 0
        ? user.teams.flatMap(team => getChallenges('team', team.teamId))
        : [];
      
      return [...userChallenges, ...teamChallenges];
    },
    enabled: !!user
  });

  // Fetch user's events
  const { data: events } = useQuery({
    queryKey: ['user-events', user?.id],
    queryFn: () => {
      if (!user) return [];
      return getUserEvents(user.id);
    },
    enabled: !!user
  });

  // Convert challenges to calendar events
  const challengeEvents = (challenges || []).map((challenge: Challenge) => ({
    id: challenge.id,
    type: 'match' as const,
    title: challenge.type === 'user' 
      ? `Match: ${challenge.challengerName} vs ${challenge.challengedName}`
      : `Team Match: ${challenge.challengerTeamName} vs ${challenge.challengedTeamName}`,
    description: `${challenge.game} - ${challenge.format}${challenge.stakes ? ` - ${challenge.stakes}` : ''}`,
    startTime: challenge.scheduledDate,
    endTime: new Date(challenge.scheduledDate.getTime() + 3600000), // 1 hour duration
    game: challenge.game,
    status: challenge.status === 'completed' ? 'completed' as const : 'upcoming' as const,
    result: challenge.result,
    location: 'Online Match',
    participants: challenge.type === 'user' 
      ? [challenge.challengerId!, challenge.challengedId!]
      : []
  }));

  // Combine all events
  const allEvents = [
    ...(events || []),
    ...challengeEvents
  ].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return allEvents;
}