import { Team, User, TeamMemberRole } from '../types';
import { updateTeam } from './teams';
import { updateProfile } from './profile';
import { createNotification } from './notifications';
import { toast } from 'react-toastify';
import { getDemoUser } from './demo-data';

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface MembershipResult {
  success: boolean;
  error?: string;
  retries?: number;
}

export async function updateMemberRole(
  team: Team,
  userId: string,
  newRole: TeamMemberRole
): Promise<MembershipResult> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
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
      await updateTeam(team.id, {
        members: updatedMembers,
        updatedAt: new Date()
      });

      // Update user's teams list
      const userTeamIndex = user.teams.findIndex(t => t.teamId === team.id);
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
          link: `/teams/${team.id}`,
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
          link: `/teams/${team.id}`,
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
        teamId: team.id,
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

export async function addTeamMember(
  team: Team,
  userId: string,
  role: TeamMemberRole = 'Member'
): Promise<MembershipResult> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Get user data
      const user = getDemoUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate user
      if (user.isBanned) {
        throw new Error('User is banned');
      }

      // Check if user is already a member
      if (team.members.some(member => member.userId === userId)) {
        throw new Error('User is already a team member');
      }

      // Validate team capacity
      if (team.members.length >= 10) {
        throw new Error('Team has reached maximum capacity');
      }

      // Check if user has required game experience
      const hasRequiredGame = user.gamesPlayed.some(game => 
        team.games.some(teamGame => teamGame.id === game.id)
      );
      if (!hasRequiredGame) {
        throw new Error('User must have experience in at least one team game');
      }

      // Update team members
      const updatedMembers = [
        ...team.members,
        {
          userId,
          role,
          joinedAt: new Date()
        }
      ];

      // Update team in database
      await updateTeam(team.id, {
        members: updatedMembers,
        updatedAt: new Date()
      });

      // Update user's teams list
      const updatedTeams = [
        ...user.teams,
        {
          teamId: team.id,
          role,
          joinedAt: new Date()
        }
      ];

      await updateProfile(userId, {
        teams: updatedTeams,
        updatedAt: new Date()
      });

      // Send notifications
      await Promise.all([
        createNotification({
          userId,
          type: 'team_invite',
          title: 'Welcome to the team!',
          message: `You are now a member of ${team.name}`,
          link: `/teams/${team.id}`,
          image: team.logo,
          isRead: false,
          createdAt: new Date()
        }),
        createNotification({
          userId: team.ownerId,
          type: 'team_invite',
          title: 'New Team Member',
          message: `${user.username} has joined ${team.name}`,
          link: `/teams/${team.id}`,
          image: user.profileImage,
          isRead: false,
          createdAt: new Date()
        })
      ]);

      toast.success(`Successfully added ${user.username} to the team`);

      return {
        success: true,
        retries
      };

    } catch (error) {
      retries++;
      
      console.error('Error adding team member:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        teamId: team.id,
        userId,
        attempt: retries,
        timestamp: new Date().toISOString()
      });

      if (retries === MAX_RETRIES) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add team member';
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

export async function removeMember(team: Team, userId: string): Promise<MembershipResult> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
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
      await updateTeam(team.id, {
        members: updatedMembers,
        updatedAt: new Date()
      });

      // Update user's teams list
      const updatedTeams = user.teams.filter(t => t.teamId !== team.id);

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
          link: `/teams/${team.id}`,
          image: team.logo,
          isRead: false,
          createdAt: new Date()
        }),
        createNotification({
          userId: team.ownerId,
          type: 'team_invite',
          title: 'Team Member Removed',
          message: `${user.username} has been removed from ${team.name}`,
          link: `/teams/${team.id}`,
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
        teamId: team.id,
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