import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Crown } from 'lucide-react';
import { demoUsers } from '../../lib/demo-data';
import { getDemoTeams } from '../../lib/teams';
import { getChallenges } from '../../lib/challenges';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';
import TotalWinsTab from './TotalWinsTab';
import WinRateTab from './WinRateTab';
import ChallengesTab from './ChallengesTab';
import MatchesTab from './MatchesTab';
import TournamentWinsTab from './TournamentWinsTab';
import RankingTab from './RankingTab';

type EntityType = 'users' | 'teams';
type TabType = 'ranking' | 'wins' | 'winRate' | 'challenges' | 'matches' | 'tournamentWins';

export default function LeaderboardPage() {
  const [entityType, setEntityType] = useState<EntityType>('users');
  const [currentTab, setCurrentTab] = useState<TabType>('ranking');
  const queryClient = useQueryClient();

  // Prefetch data
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: () => demoUsers
    });
    queryClient.prefetchQuery({
      queryKey: ['teams'],
      queryFn: getDemoTeams
    });
    queryClient.prefetchQuery({
      queryKey: ['all-challenges'],
      queryFn: () => getChallenges('', '')
    });
  }, [queryClient]);

  // Use stale time and caching for better performance
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => demoUsers,
    staleTime: 30000, // Data stays fresh for 30 seconds
    cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
    enabled: entityType === 'users'
  });

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: getDemoTeams,
    staleTime: 30000,
    cacheTime: 1000 * 60 * 5,
    enabled: entityType === 'teams'
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['all-challenges'],
    queryFn: () => getChallenges('', ''),
    staleTime: 30000,
    cacheTime: 1000 * 60 * 5
  });

  const isLoading = usersLoading || teamsLoading || challengesLoading;

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!users || !teams || !challenges) {
    return <ErrorDisplay error={new Error('Failed to load leaderboard data')} />;
  }

  const entities = entityType === 'users' ? users : teams;

  const renderTabContent = () => {
    switch (currentTab) {
      case 'ranking':
        return <RankingTab entities={entities} entityType={entityType} />;
      case 'wins':
        return <TotalWinsTab entities={entities} entityType={entityType} />;
      case 'winRate':
        return <WinRateTab entities={entities} entityType={entityType} />;
      case 'challenges':
        return <ChallengesTab entities={entities} entityType={entityType} challenges={challenges} />;
      case 'matches':
        return <MatchesTab entities={entities} entityType={entityType} challenges={challenges} />;
      case 'tournamentWins':
        return <TournamentWinsTab entities={entities} entityType={entityType} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <Crown className="w-8 h-8 text-gaming-neon" />
          Leaderboard
        </h1>

        {/* Entity Type Toggle */}
        <div className="flex gap-2 bg-gaming-dark rounded-lg p-1">
          <button
            onClick={() => setEntityType('users')}
            className={`px-4 py-2 rounded-md transition-colors ${
              entityType === 'users'
                ? 'bg-gaming-neon text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Players
          </button>
          <button
            onClick={() => setEntityType('teams')}
            className={`px-4 py-2 rounded-md transition-colors ${
              entityType === 'teams'
                ? 'bg-gaming-neon text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCurrentTab('ranking')}
          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            currentTab === 'ranking'
              ? 'bg-gaming-neon text-black'
              : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
          }`}
        >
          Ranking
        </button>
        <button
          onClick={() => setCurrentTab('wins')}
          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            currentTab === 'wins'
              ? 'bg-gaming-neon text-black'
              : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
          }`}
        >
          Total Wins
        </button>
        <button
          onClick={() => setCurrentTab('winRate')}
          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            currentTab === 'winRate'
              ? 'bg-gaming-neon text-black'
              : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
          }`}
        >
          Win Rate
        </button>
        <button
          onClick={() => setCurrentTab('challenges')}
          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            currentTab === 'challenges'
              ? 'bg-gaming-neon text-black'
              : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
          }`}
        >
          Challenges
        </button>
        <button
          onClick={() => setCurrentTab('matches')}
          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            currentTab === 'matches'
              ? 'bg-gaming-neon text-black'
              : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setCurrentTab('tournamentWins')}
          className={`px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
            currentTab === 'tournamentWins'
              ? 'bg-gaming-neon text-black'
              : 'bg-gaming-dark text-white hover:bg-gaming-neon/20'
          }`}
        >
          Tournament Wins
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}