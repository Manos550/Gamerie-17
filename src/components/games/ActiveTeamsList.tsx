import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import TeamCard from './TeamCard';
import Pagination from './Pagination';
import { getActiveGameTeams } from '../../lib/games';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';

interface ActiveTeamsListProps {
  gameId: string;
}

export default function ActiveTeamsList({ gameId }: ActiveTeamsListProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [minRanking, setMinRanking] = useState<number>();
  const debouncedSearch = useDebounce(searchTerm, 300);
  const TEAMS_PER_PAGE = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['game-active-teams', gameId, page, debouncedSearch, region, minRanking],
    queryFn: () => getActiveGameTeams(gameId, page, TEAMS_PER_PAGE, {
      region,
      minRanking,
      searchTerm: debouncedSearch
    }),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gaming-dark border border-gaming-neon/20 text-white placeholder-gray-400 focus:outline-none focus:border-gaming-neon"
          />
        </div>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
        >
          <option value="">All Regions</option>
          <option value="NA">North America</option>
          <option value="EU">Europe</option>
          <option value="ASIA">Asia</option>
          <option value="OCE">Oceania</option>
        </select>

        <select
          value={minRanking || ''}
          onChange={(e) => setMinRanking(e.target.value ? Number(e.target.value) : undefined)}
          className="px-4 py-2 rounded-lg bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
        >
          <option value="">All Rankings</option>
          <option value="1000">1000+</option>
          <option value="2000">2000+</option>
          <option value="3000">3000+</option>
        </select>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data?.teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}