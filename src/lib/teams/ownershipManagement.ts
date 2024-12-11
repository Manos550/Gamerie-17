import { Team } from '../../types';
import { updateTeam } from '../teams';
import { updateProfile } from '../profile';
import { createNotification } from '../notifications';
import { getDemoUser } from '../demo-data';
import { toast } from 'react-toastify';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface TransferResult {
  success: boolean;
  error?: string;
  retries?: number;
}

export async function transferOwnership(
  teamId: string, 
  newOwnerId: string
): Promise<TransferResult> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Get team data
      const team = await getTeamById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Get new owner data
      const newOwner = getDemoUser(newOwnerId);
      if (!newOwner) {
        throw new Error('New owner not found');
      }

      // Validate new owner is a team member
      const memberIndex = team.members.findIndex(member => member.userId === newOwnerId);
      if (memberIndex === -1) {
        throw new Error('New owner must be a team member');
      }

      // Validate new owner has appropriate role
      const newOwnerMember = team.members[memberIndex];
      if (!['Leader', 'Deputy Leader'].includes(newOwnerMember.role)) {
        throw new Error('New owner must be a Leader or Deputy Leader');
      }

      // Get current owner data
      const currentOwner = getDemoUser(team.ownerId);
      if (!currentOwner) {
        throw new Error('Current owner not found');
      }

      // Update team ownership
      const updatedMembers = team.members.map(member => {
        if (member.userId === newOwnerId) {
          return { ...member, role: 'owner' };
        }
        if (member.userId === team.ownerId) {
          return { ...member, role: 'Member' };
        }
        return member;
      });

      await updateTeam(teamId, {
        ownerId: newOwnerId,
        members: updatedMembers,
        updatedAt: new Date()
      });

      // Update new owner's profile
      await updateProfile(newOwnerId, {
        teams: newOwner.teams.map(t => 
          t.teamId === teamId ? { ...t, role: 'owner' } : t
        )
      });

      // Update previous owner's profile
      await updateProfile(team.ownerId, {
        teams: currentOwner.teams.map(t => 
          t.teamId === teamId ? { ...t, role: 'Member' } : t
        )
      });

      // Send notifications
      await Promise.all([
        // Notify new owner
        createNotification({
          userId: newOwnerId,
          type: 'team_invite',
          title: 'Team Ownership Transferred',
          message: `You are now the owner of ${team.name}`,
          link: `/teams/${teamId}`,
          image: team.logo,
          isRead: false,
          createdAt: new Date()
        }),
        // Notify previous owner
        createNotification({
          userId: team.ownerId,
          type: 'team_invite',
          title: 'Team Ownership Transferred',
          message: `Team ownership of ${team.name} has been transferred to ${newOwner.username}`,
          link: `/teams/${teamId}`,
          image: team.logo,
          isRead: false,
          createdAt: new Date()
        })
      ]);

      toast.success('Team ownership transferred successfully');

      return {
        success: true,
        retries
      };

    } catch (error) {
      retries++;
      
      console.error('Error transferring ownership:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        teamId,
        newOwnerId,
        attempt: retries,
        timestamp: new Date().toISOString()
      });

      if (retries === MAX_RETRIES) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to transfer ownership';
        return {
          success: false,
          error: errorMessage,
          retries
        };
      }

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
    }
  }

  return {
    success: false,
    error: 'Maximum retries exceeded',
    retries
  };
}

async function getTeamById(teamId: string): Promise<Team | null> {
  // In demo mode, get team from demo data
  if (import.meta.env.MODE === 'development') {
    const teams = await import('../teams').then(m => m.getDemoTeams());
    return teams.find(t => t.id === teamId) || null;
  }

  // In production, get team from Firebase
  return null;
}