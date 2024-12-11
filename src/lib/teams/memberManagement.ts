import { Team, TeamMemberRole } from '../../types';
import { updateTeam } from '../teams';
import { updateProfile } from '../profile';
import { createNotification } from '../notifications';
import { getDemoUser } from '../demo-data';
import { toast } from 'react-toastify';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface MembershipResult {
  success: boolean;
  error?: string;
  retries?: number;
}

export async function updateMemberRole(
  teamId: string,
  userId: string,
  newRole: TeamMemberRole
): Promise<MembershipResult> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Get team data
      const team = await getTeamById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Get user data
      const user = getDemoUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate user is a member
      const memberIndex = team.members.findIndex(member => member.userId === userId);
      if (memberIndex === -1) {
        throw new Error('User is not a team member');
      }

      // Prevent role changes for team owner
      if (userId === team.ownerId && newRole !== 'owner') {
        throw new Error('Cannot change team owner role');
      }

      // Update member role
      const updatedMembers = [...team.members];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        role: newRole
      };

      // Update team in database
      await updateTeam(teamId, {
        members: updatedMembers,
        updatedAt: new Date()
      });

      // Update user's teams list
      const userTeamIndex = user.teams.findIndex(t => t.teamId === teamId);
      if (userTeamIndex !== -1) {
        const updatedTeams = [...user.teams];
        updatedTeams[userTeamIndex] = {
          ...updatedTeams[userTeamIndex],
          role: newRole
        };

        await updateProfile(userId, {
          teams: updatedTeams,
          updatedAt: new Date()
        });
      }

      // Send notifications
      await Promise.all([
        // Notify member of role change
        createNotification({
          userId,
          type: 'team_invite',
          title: 'Role Updated',
          message: `Your role in ${team.name} has been updated to ${newRole}`,
          link: `/teams/${teamId}`,
          image: team.logo,
          isRead: false,
          createdAt: new Date()
        }),
        // Notify team owner
        createNotification({
          userId: team.ownerId,
          type: 'team_invite',
          title: 'Team Member Role Updated',
          message: `${user.username}'s role has been updated to ${newRole}`,
          link: `/teams/${teamId}`,
          image: user.profileImage,
          isRead: false,
          createdAt: new Date()
        })
      ]);

      toast.success(`Successfully updated ${user.username}'s role to ${newRole}`);

      return {
        success: true,
        retries
      };

    } catch (error) {
      retries++;
      
      console.error('Error updating member role:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        teamId,
        userId,
        newRole,
        attempt: retries,
        timestamp: new Date().toISOString()
      });

      if (retries === MAX_RETRIES) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update member role';
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

export async function removeMember(teamId: string, userId: string): Promise<MembershipResult> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Get team data
      const team = await getTeamById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Get user data
      const user = getDemoUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Prevent removing team owner
      if (userId === team.ownerId) {
        throw new Error('Cannot remove team owner');
      }

      // Validate user is a member
      if (!team.members.some(member => member.userId === userId)) {
        throw new Error('User is not a team member');
      }

      // Update team members
      const updatedMembers = team.members.filter(member => member.userId !== userId);

      // Update team in database
      await updateTeam(teamId, {
        members: updatedMembers,
        updatedAt: new Date()
      });

      // Update user's teams list
      const updatedTeams = user.teams.filter(t => t.teamId !== teamId);

      await updateProfile(userId, {
        teams: updatedTeams,
        updatedAt: new Date()
      });

      // Send notifications
      await Promise.all([
        createNotification({
          userId,
          type: 'team_invite',
          title: 'Team Membership Ended',
          message: `You are no longer a member of ${team.name}`,
          link: `/teams/${teamId}`,
          image: team.logo,
          isRead: false,
          createdAt: new Date()
        }),
        createNotification({
          userId: team.ownerId,
          type: 'team_invite',
          title: 'Team Member Removed',
          message: `${user.username} has been removed from ${team.name}`,
          link: `/teams/${teamId}`,
          image: user.profileImage,
          isRead: false,
          createdAt: new Date()
        })
      ]);

      toast.success(`Successfully removed ${user.username} from the team`);

      return {
        success: true,
        retries
      };

    } catch (error) {
      retries++;
      
      console.error('Error removing team member:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        teamId,
        userId,
        attempt: retries,
        timestamp: new Date().toISOString()
      });

      if (retries === MAX_RETRIES) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove team member';
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