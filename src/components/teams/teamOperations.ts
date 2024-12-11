import { Team } from '../../types';
import { updateTeam } from '../../lib/teams';
import { updateProfile } from '../../lib/profile';
import { createNotification } from '../../lib/notifications';
import { toast } from 'react-toastify';
import { getDemoUser } from '../../lib/demo-data';

export async function transferOwnership(teamId: string, newOwnerId: string): Promise<void> {
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
  } catch (error) {
    console.error('Error transferring team ownership:', error);
    toast.error('Failed to transfer team ownership');
    throw error;
  }
}

async function getTeamById(teamId: string): Promise<Team | null> {
  // In demo mode, get team from demo data
  if (import.meta.env.MODE === 'development') {
    const teams = await import('../../lib/teams').then(m => m.getDemoTeams());
    return teams.find(t => t.id === teamId) || null;
  }

  // In production, get team from Firebase
  return null;
}