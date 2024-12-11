import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';
import { useAuthStore } from './store';
import { toast } from 'react-toastify';
import { updateDemoUser } from './demo-data';
import { getDemoTeams } from './teams';

// Demo mode helper
const isDemoMode = import.meta.env.MODE === 'development';

export const followUser = async (targetUserId: string): Promise<void> => {
  const currentUser = useAuthStore.getState().user;
  if (!currentUser) return;

  try {
    if (isDemoMode) {
      // Update current user's following list
      const updatedCurrentUser = {
        ...currentUser,
        following: Array.from(new Set([...currentUser.following, targetUserId]))
      };
      updateDemoUser(currentUser.id, updatedCurrentUser);

      // Update target user's followers list
      updateDemoUser(targetUserId, {
        followers: Array.from(new Set([...currentUser.followers || [], currentUser.id]))
      });

      // Update local state
      useAuthStore.getState().setUser(updatedCurrentUser);

      toast.success('Successfully followed user');
      return;
    }

    // Update current user's following list
    const currentUserRef = doc(db, 'users', currentUser.id);
    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUserId)
    });

    // Update target user's followers list
    const targetUserRef = doc(db, 'users', targetUserId);
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUser.id)
    });

    toast.success('Successfully followed user');
  } catch (error) {
    toast.error('Failed to follow user');
    throw error;
  }
};

export const unfollowUser = async (targetUserId: string): Promise<void> => {
  const currentUser = useAuthStore.getState().user;
  if (!currentUser) return;

  try {
    if (isDemoMode) {
      // Update current user's following list
      const updatedCurrentUser = {
        ...currentUser,
        following: currentUser.following.filter(id => id !== targetUserId)
      };
      updateDemoUser(currentUser.id, updatedCurrentUser);

      // Update target user's followers list
      updateDemoUser(targetUserId, {
        followers: currentUser.followers.filter(id => id !== currentUser.id)
      });

      // Update local state
      useAuthStore.getState().setUser(updatedCurrentUser);

      toast.success('Successfully unfollowed user');
      return;
    }

    // Update current user's following list
    const currentUserRef = doc(db, 'users', currentUser.id);
    await updateDoc(currentUserRef, {
      following: arrayRemove(targetUserId)
    });

    // Update target user's followers list
    const targetUserRef = doc(db, 'users', targetUserId);
    await updateDoc(targetUserRef, {
      followers: arrayRemove(currentUser.id)
    });

    toast.success('Successfully unfollowed user');
  } catch (error) {
    toast.error('Failed to unfollow user');
    throw error;
  }
};

export const followTeam = async (teamId: string): Promise<void> => {
  const currentUser = useAuthStore.getState().user;
  if (!currentUser) return;

  try {
    if (isDemoMode) {
      // Update team's followers list
      const teams = await getDemoTeams();
      const teamIndex = teams.findIndex(t => t.id === teamId);
      if (teamIndex !== -1) {
        teams[teamIndex] = {
          ...teams[teamIndex],
          followers: Array.from(new Set([...teams[teamIndex].followers, currentUser.id]))
        };
      }

      toast.success('Successfully followed team');
      return;
    }

    // Update team's followers list
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, {
      followers: arrayUnion(currentUser.id)
    });

    toast.success('Successfully followed team');
  } catch (error) {
    toast.error('Failed to follow team');
    throw error;
  }
};

export const unfollowTeam = async (teamId: string): Promise<void> => {
  const currentUser = useAuthStore.getState().user;
  if (!currentUser) return;

  try {
    if (isDemoMode) {
      // Update team's followers list
      const teams = await getDemoTeams();
      const teamIndex = teams.findIndex(t => t.id === teamId);
      if (teamIndex !== -1) {
        teams[teamIndex] = {
          ...teams[teamIndex],
          followers: teams[teamIndex].followers.filter(id => id !== currentUser.id)
        };
      }

      toast.success('Successfully unfollowed team');
      return;
    }

    // Update team's followers list
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, {
      followers: arrayRemove(currentUser.id)
    });

    toast.success('Successfully unfollowed team');
  } catch (error) {
    toast.error('Failed to unfollow team');
    throw error;
  }
};