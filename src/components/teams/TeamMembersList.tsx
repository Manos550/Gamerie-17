import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings } from 'lucide-react';
import { Team } from '../../types';
import { getDemoUser } from '../../lib/demo-data';
import OnlineStatus from '../shared/OnlineStatus';

interface TeamMembersListProps {
  team: Team;
  isTeamOwner: boolean;
  onManageMembers: () => void;
}

export default function TeamMembersList({ team, isTeamOwner, onManageMembers }: TeamMembersListProps) {
  // Get member details
  const memberDetails = team.members.map(member => ({
    ...member,
    user: getDemoUser(member.userId)
  })).filter(member => member.user);

  return (
    <div className="bg-gaming-card rounded-lg p-6 border border-gaming-neon/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gaming-neon" />
          <h2 className="font-display text-xl font-bold text-white">Members</h2>
        </div>
        {isTeamOwner && (
          <button
            onClick={onManageMembers}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gaming-neon/10 text-gaming-neon rounded-md hover:bg-gaming-neon/20 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Manage
          </button>
        )}
      </div>

      <div className="space-y-4">
        {memberDetails.map(({ user, role }) => (
          <Link
            key={user!.id}
            to={`/profile/${user!.id}`}
            className="flex items-center justify-between p-3 rounded-lg bg-gaming-dark/50 hover:bg-gaming-dark transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user!.profileImage}
                  alt={user!.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="absolute -bottom-1 -right-1">
                  <OnlineStatus userId={user!.id} />
                </div>
              </div>
              <div>
                <div className="text-white group-hover:text-gaming-neon transition-colors">
                  {user!.username}
                </div>
                <div className="text-sm text-gaming-neon">
                  {role}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {user!.gamerTitle}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}