import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import UserCard from './UserCard';
import Pagination from './Pagination';
import { getActiveGameUsers } from '../../lib/games';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorDisplay from '../shared/ErrorDisplay';

interface ActiveUsersListProps {
  gameId: string;
}

export default function ActiveUsersList({ gameId }: ActiveUsersListProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const USERS_PER_PAGE = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['game-active-users', gameId, page, debouncedSearch],
    queryFn: () => getActiveGameUsers(gameId, page, USERS_PER_PAGE, debouncedSearch),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search players..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gaming-dark border border-gaming-neon/20 text-white placeholder-gray-400 focus:outline-none focus:border-gaming-neon"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.users.map((user) => (
          <UserCard key={user.id} user={user} gameId={gameId} />
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