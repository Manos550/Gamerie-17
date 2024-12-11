import React, { useState } from 'react';
import { X, UserCheck, AlertCircle } from 'lucide-react';
import { Team } from '../../types';
import { useNavigate } from 'react-router-dom';
import { getDemoUser } from '../../lib/demo-data';
import { transferOwnership } from '../../lib/teams/ownershipManagement';
import { toast } from 'react-toastify';
import LoadingSpinner from '../shared/LoadingSpinner';

interface TransferOwnershipModalProps {
  team: Team;
  onClose: () => void;
}

export default function TransferOwnershipModal({ team, onClose }: TransferOwnershipModalProps) {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get eligible members (excluding current owner)
  const eligibleMembers = team.members
    .filter(member => 
      member.userId !== team.ownerId && 
      ['Leader', 'Deputy Leader'].includes(member.role)
    )
    .map(member => ({
      ...member,
      user: getDemoUser(member.userId)
    }))
    .filter(member => member.user);

  const handleTransfer = async () => {
    if (!selectedUserId) {
      toast.error('Please select a team member');
      return;
    }

    if (!window.confirm('Are you sure you want to transfer ownership? This action cannot be undone.')) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await transferOwnership(team.id, selectedUserId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to transfer ownership');
      }

      navigate('/teams');
    } catch (error) {
      console.error('Error transferring ownership:', error);
      toast.error('Failed to transfer ownership');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-card rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-white">Transfer Team Ownership</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {eligibleMembers.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-gaming-accent mx-auto mb-4" />
            <p className="text-gray-300 mb-2">No Eligible Members</p>
            <p className="text-sm text-gray-400">
              Only team leaders and deputy leaders are eligible to receive ownership.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-4">
              Select a team member to transfer ownership to. Only leaders and deputy leaders are eligible.
              This action cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select New Owner
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
              >
                <option value="">Select a member</option>
                {eligibleMembers.map(({ user, role }) => (
                  <option key={user!.id} value={user!.id}>
                    {user!.username} ({role})
                  </option>
                ))}
              </select>
            </div>

            {selectedUserId && (
              <div className="mb-6 p-4 rounded-lg bg-gaming-dark/50">
                <div className="flex items-center gap-3">
                  <img
                    src={eligibleMembers.find(m => m.user!.id === selectedUserId)?.user!.profileImage}
                    alt="Selected user"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-white">
                      {eligibleMembers.find(m => m.user!.id === selectedUserId)?.user!.username}
                    </div>
                    <div className="text-sm text-gaming-neon">
                      {eligibleMembers.find(m => m.user!.id === selectedUserId)?.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!selectedUserId || isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner className="w-4 h-4" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Transfer Ownership</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}