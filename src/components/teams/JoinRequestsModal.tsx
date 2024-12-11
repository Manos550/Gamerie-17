import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Check, X as XIcon } from 'lucide-react';
import { Team } from '../../types';
import { addTeamMember } from '../../lib/membership';
import { rejectJoinRequest } from '../../lib/teams';
import { useNavigate } from 'react-router-dom';
import { getDemoUser } from '../../lib/demo-data';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import LoadingSpinner from '../shared/LoadingSpinner';

interface JoinRequestsModalProps {
  team: Team;
  onClose: () => void;
}

export default function JoinRequestsModal({ team, onClose }: JoinRequestsModalProps) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);
  const [requests] = React.useState(() => {
    // Generate validated demo requests
    const demoRequests = [
      {
        id: 'request-1',
        userId: 'user-4', // ArcticWolf
        teamId: team.id,
        status: 'pending',
        message: 'Looking to join a competitive team. I have extensive tournament experience and am dedicated to improving.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ].filter(request => {
      // Validate each request
      const user = getDemoUser(request.userId);
      if (!user || user.isBanned || user.gameLevel === 'Beginner') {
        return false;
      }
      
      // Check if user is already a team member
      const isAlreadyMember = team.members.some(member => member.userId === request.userId);
      return !isAlreadyMember;
    });

    return demoRequests;
  });

  const handleAccept = async (requestId: string, userId: string) => {
    try {
      // Double-check if user is already a member before proceeding
      if (team.members.some(member => member.userId === userId)) {
        toast.error('User is already a team member');
        return;
      }

      setIsProcessing(requestId);
      const result = await addTeamMember(team, userId);
      
      if (result.success) {
        // Remove the request after successful addition
        await rejectJoinRequest(requestId);
        queryClient.invalidateQueries({ queryKey: ['team', team.id] });
        toast.success('Member added successfully');
        
        // Close modal if no more requests
        if (requests.length === 1) {
          onClose();
        }
      } else {
        toast.error(result.error || 'Failed to accept request');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept request';
      console.error('Error accepting request:', error);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setIsProcessing(requestId);
      await rejectJoinRequest(requestId);
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });
      toast.success('Request rejected successfully');
      
      // Close modal if no more requests
      if (requests.length === 1) {
        onClose();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-card rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-white">Join Requests</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-center py-4 text-gray-400">No pending join requests</p>
          ) : (
            requests.map((request) => {
              const user = getDemoUser(request.userId);
              if (!user) return null;

              const isProcessingThis = isProcessing === request.id;

              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gaming-dark/50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-white">{user.username}</div>
                      <div className="text-sm text-gray-400">
                        Requested {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                      </div>
                      {request.message && (
                        <p className="text-sm text-gray-300 mt-1">{request.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isProcessingThis ? (
                      <div className="p-2">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAccept(request.id, request.userId)}
                          className="p-2 text-gaming-neon hover:bg-gaming-neon/10 rounded-full transition-colors"
                          title="Accept request"
                          disabled={isProcessing !== null}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-2 text-gaming-accent hover:bg-gaming-accent/10 rounded-full transition-colors"
                          title="Reject request"
                          disabled={isProcessing !== null}
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}