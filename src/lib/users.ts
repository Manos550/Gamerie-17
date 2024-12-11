import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'react-toastify';
import { demoUsers, updateDemoUser } from './demo-data';

// Demo mode helper
const isDemoMode = import.meta.env.MODE === 'development';

export const banUser = async (userId: string): Promise<void> => {
  try {
    if (isDemoMode) {
      updateDemoUser(userId, {
        isBanned: true,
        updatedAt: new Date()
      });
      toast.success('User banned successfully');
      return;
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: true,
      updatedAt: serverTimestamp()
    });
    toast.success('User banned successfully');
  } catch (error) {
    console.error('Error banning user:', error);
    toast.error('Failed to ban user');
    throw error;
  }
};

export const unbanUser = async (userId: string): Promise<void> => {
  try {
    if (isDemoMode) {
      updateDemoUser(userId, {
        isBanned: false,
        updatedAt: new Date()
      });
      toast.success('User unbanned successfully');
      return;
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: false,
      updatedAt: serverTimestamp()
    });
    toast.success('User unbanned successfully');
  } catch (error) {
    console.error('Error unbanning user:', error);
    toast.error('Failed to unban user');
    throw error;
  }
};