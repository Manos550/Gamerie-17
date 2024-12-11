import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Team } from '../../types';
import { getDemoTeams, banTeam, unbanTeam } from '../../lib/teams';
import { Search, Shield, Trash2, Users, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

export default function TeamsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: teams, refetch } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: async () => {
      if (import.meta.env.MODE === 'development') {
        return getDemoTeams();
      }
      return [];
    }
  });

  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await banTeam(teamId);
        await refetch();
        toast.success('Team deleted successfully');
      } catch (error) {
        toast.error('Failed to delete team');
        console.error('Delete team error:', error);
      }
    }
  };

  const handleBanTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to ban this team?')) {
      try {
        await banTeam(teamId);
        await refetch();
        toast.success('Team banned successfully');
      } catch (error) {
        toast.error('Failed to ban team');
        console.error('Ban team error:', error);
      }
    }
  };

  const handleUnbanTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to unban this team?')) {
      try {
        await unbanTeam(teamId);
        await refetch();
        toast.success('Team unbanned successfully');
      } catch (error) {
        toast.error('Failed to unban team');
        console.error('Unban team error:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Teams</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams..."
            className="pl-9 pr-4 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white placeholder-gray-400 focus:outline-none focus:border-gaming-neon"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTeams?.map((team) => (
          <div
            key={team.id}
            className={`bg-gaming-dark/50 rounded-lg p-4 flex items-center justify-between ${
              team.isBanned ? 'opacity-75 grayscale' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={team.logo}
                alt={team.name}
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h3 className="font-bold text-white">
                  {team.name}
                  {team.isBanned && (
                    <span className="ml-2 text-sm text-gaming-accent">(Banned)</span>
                  )}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {team.members.length} members
                  </div>
                  <span>•</span>
                  <div>
                    Created {formatDistanceToNow(team.createdAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {team.level}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => team.isBanned ? handleUnbanTeam(team.id) : handleBanTeam(team.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                    team.isBanned
                      ? 'bg-gaming-neon/10 text-gaming-neon hover:bg-gaming-neon/20'
                      : 'bg-gaming-accent/10 text-gaming-accent hover:bg-gaming-accent/20'
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {team.isBanned ? 'Unban' : 'Ban'}
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-gaming-accent/10 text-gaming-accent rounded-md hover:bg-gaming-accent/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}