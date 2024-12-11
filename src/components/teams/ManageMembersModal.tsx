import React from 'react';
import { X, Shield, UserMinus } from 'lucide-react';
import { Team, TeamMemberRole } from '../../types';
import { updateMemberRole, removeMember } from '../../lib/teams/memberManagement';
import { useQueryClient } from '@tanstack/react-query';
import { getDemoUser } from '../../lib/demo-data';
import { toast } from 'react-toastify';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ManageMembersModalProps {
  team: Team;
  onClose: () => void;
}

export default function ManageMembersModal({ team, onClose }: ManageMembersModalProps) {
  const queryClient = useQueryClient();
  const [processingMember, setProcessingMember] = React.useState<string | null>(null);

  // Get member details
  const memberDetails = team.members.map(member => ({
    ...member,
    user: getDemoUser(member.userId)
  })).filter(member => member.user);

  const handleRoleChange = async (userId: string, newRole: TeamMemberRole) => {
    setProcessingMember(userId);
    try {
      const result = await updateMemberRole(team.id, userId, newRole);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update role');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      queryClient.invalidateQueries({ queryKey: ['team-members', team.members] });

    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    } finally {
      setProcessingMember(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    setProcessingMember(userId);
    try {
      const result = await removeMember(team.id, userId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove member');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      queryClient.invalidateQueries({ queryKey: ['team-members', team.members] });

    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    } finally {
      setProcessingMember(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-card rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gaming-neon" />
            <h2 className="font-display text-xl font-bold text-white">Manage Members</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {memberDetails.map(({ user, role, userId }) => (
            <div
              key={userId}
              className="flex items-center justify-between p-4 rounded-lg bg-gaming-dark/50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user!.profileImage}
                  alt={user!.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-white">{user!.username}</div>
                  <div className="text-sm text-gaming-neon">{role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {processingMember === userId ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <select
                      value={role}
                      onChange={(e) => handleRoleChange(userId, e.target.value as TeamMemberRole)}
                      className="px-3 py-1 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
                      disabled={userId === team.ownerId}
                    >
                      <option value="Leader">Leader</option>
                      <option value="Deputy Leader">Deputy Leader</option>
                      <option value="Member">Member</option>
                    </select>

                    {userId !== team.ownerId && (
                      <button
                        onClick={() => handleRemoveMember(userId)}
                        className="p-2 text-gaming-accent hover:bg-gaming-accent/10 rounded-full transition-colors"
                        disabled={processingMember !== null}
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {memberDetails.length === 0 && (
            <p className="text-center py-4 text-gray-400">No members found</p>
          )}
        </div>
      </div>
    </div>
  );
}