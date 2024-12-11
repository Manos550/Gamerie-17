import { doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, deleteDoc, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { useAuthStore } from './store';
import { toast } from 'react-toastify';
import { GamePage, GameUser, GameTeam } from '../types';
import { demoUsers } from './demo-data';
import { getDemoTeams } from './teams';

// Demo game pages with enhanced content
const demoGames: GamePage[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    wallPhoto: 'https://www.counter-strike.net/static/images/cs2/cs2_header.jpg',
    description: 'Counter-Strike 2 is the largest technical leap forward in Counter-Strike history, ensuring new features and updates for years to come.',
    company: 'Valve Corporation',
    gameType: 'Tactical First-Person Shooter (FPS)',
    gameModes: [
      'Competitive',
      'Casual',
      'Deathmatch',
      'Wingman',
      'Arms Race',
      'Demolition'
    ],
    requiredSkills: [
      'Aim precision',
      'Map knowledge',
      'Economy management',
      'Team coordination',
      'Strategic thinking',
      'Utility usage'
    ],
    followers: [],
    teams: [],
    platforms: ['PC'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/CSGO' },
      { platform: 'YouTube', url: 'https://youtube.com/csgo' },
      { platform: 'Instagram', url: 'https://instagram.com/csgo' }
    ],
    officialWebsite: 'https://www.counter-strike.net',
    followers_stats: {
      total: 3500000,
      active_gamers: 2500000,
      streamers: 450000,
      spectators: 550000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // ... other demo games
];

export const createGame = async (data: Partial<GamePage> & { wallPhoto?: File }): Promise<void> => {
  try {
    let wallPhotoUrl = '';

    if (import.meta.env.MODE === 'development') {
      if (data.wallPhoto) {
        wallPhotoUrl = URL.createObjectURL(data.wallPhoto);
      }
      toast.success('Game created successfully');
      return;
    }

    if (data.wallPhoto) {
      const fileRef = ref(storage, `games/${data.id}/wall-photo`);
      await uploadBytes(fileRef, data.wallPhoto);
      wallPhotoUrl = await getDownloadURL(fileRef);
    }

    await addDoc(collection(db, 'games'), {
      ...data,
      wallPhoto: wallPhotoUrl,
      followers: [],
      teams: [],
      followers_stats: {
        total: 0,
        active_gamers: 0,
        streamers: 0,
        spectators: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });

    toast.success('Game created successfully');
  } catch (error) {
    console.error('Error creating game:', error);
    toast.error('Failed to create game');
    throw error;
  }
};

export const updateGame = async (gameId: string, updates: Partial<GamePage> & { wallPhoto?: File }): Promise<void> => {
  try {
    let wallPhotoUrl = '';

    if (import.meta.env.MODE === 'development') {
      if (updates.wallPhoto) {
        wallPhotoUrl = URL.createObjectURL(updates.wallPhoto);
      }
      toast.success('Game updated successfully');
      return;
    }

    if (updates.wallPhoto) {
      const fileRef = ref(storage, `games/${gameId}/wall-photo`);
      await uploadBytes(fileRef, updates.wallPhoto);
      wallPhotoUrl = await getDownloadURL(fileRef);
    }

    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      ...updates,
      ...(wallPhotoUrl && { wallPhoto: wallPhotoUrl }),
      updatedAt: new Date()
    });

    toast.success('Game updated successfully');
  } catch (error) {
    console.error('Error updating game:', error);
    toast.error('Failed to update game');
    throw error;
  }
};

export const deleteGame = async (gameId: string): Promise<void> => {
  try {
    if (import.meta.env.MODE === 'development') {
      toast.success('Game deleted successfully');
      return;
    }

    await deleteDoc(doc(db, 'games', gameId));
    toast.success('Game deleted successfully');
  } catch (error) {
    console.error('Error deleting game:', error);
    toast.error('Failed to delete game');
    throw error;
  }
};

export const followGame = async (gameId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to follow games');

  try {
    if (import.meta.env.MODE === 'development') {
      toast.success('Successfully followed game');
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      followers: arrayUnion(user.id)
    });

    toast.success('Successfully followed game');
  } catch (error) {
    toast.error('Failed to follow game');
    throw error;
  }
};

export const unfollowGame = async (gameId: string): Promise<void> => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Must be logged in to unfollow games');

  try {
    if (import.meta.env.MODE === 'development') {
      toast.success('Successfully unfollowed game');
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      followers: arrayRemove(user.id)
    });

    toast.success('Successfully unfollowed game');
  } catch (error) {
    toast.error('Failed to unfollow game');
    throw error;
  }
};

export const getActiveGameTeams = async (
  gameId: string,
  page: number = 1,
  perPage: number = 20,
  filters: {
    region?: string;
    minRanking?: number;
    searchTerm?: string;
  } = {}
): Promise<{ teams: GameTeam[]; totalPages: number }> => {
  if (import.meta.env.MODE === 'development') {
    let teams = getDemoTeams()
      .filter(team => team.games.some(game => game.id === gameId))
      .map(team => ({
        id: team.id,
        name: team.name,
        logo: team.logo,
        description: team.description,
        ranking: team.stats.ranking,
        region: team.region || 'Global',
        roster: team.members.map(member => ({
          userId: member.userId,
          role: member.role,
          position: 'Player'
        })),
        recentMatches: team.stats.matchesPlayed > 0 ? Array(5).fill(null).map((_, i) => ({
          id: `match-${i}`,
          opponent: `Team ${i + 1}`,
          result: Math.random() > 0.5 ? 'win' : 'loss',
          score: `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`,
          date: new Date(Date.now() - (i * 86400000))
        })) : [],
        upcomingMatches: Array(2).fill(null).map((_, i) => ({
          id: `upcoming-${i}`,
          opponent: `Team ${i + 10}`,
          date: new Date(Date.now() + ((i + 1) * 86400000)),
          tournament: `Tournament ${i + 1}`
        })),
        socialLinks: team.socialMedia,
        stats: {
          winRate: (team.stats.wins / (team.stats.wins + team.stats.losses)) * 100,
          tournamentWins: team.stats.tournamentWins,
          ranking: team.stats.ranking
        }
      }));

    // Apply filters
    if (filters.region) {
      teams = teams.filter(team => 
        team.region.toLowerCase() === filters.region.toLowerCase()
      );
    }

    if (filters.minRanking) {
      teams = teams.filter(team => team.ranking >= filters.minRanking);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      teams = teams.filter(team =>
        team.name.toLowerCase().includes(term) ||
        team.description.toLowerCase().includes(term)
      );
    }

    // Sort by ranking
    teams.sort((a, b) => a.ranking - b.ranking);

    // Calculate pagination
    const totalPages = Math.ceil(teams.length / perPage);
    const start = (page - 1) * perPage;
    const paginatedTeams = teams.slice(start, start + perPage);

    return {
      teams: paginatedTeams,
      totalPages
    };
  }

  return { teams: [], totalPages: 0 };
};

export const getActiveGameUsers = async (
  gameId: string,
  page: number = 1,
  perPage: number = 20,
  searchTerm: string = ''
): Promise<{ users: GameUser[]; totalPages: number }> => {
  if (import.meta.env.MODE === 'development') {
    let users = demoUsers
      .filter(user => user.gamesPlayed.some(game => game.id === gameId))
      .map(user => {
        const gameProfile = user.gamesPlayed.find(game => game.id === gameId)!;
        return {
          id: user.id,
          username: user.username,
          profileImage: user.profileImage,
          currentRank: gameProfile.rank || 'Unranked',
          playtime: gameProfile.hoursPlayed * 60, // Convert hours to minutes
          lastActive: user.lastSeen,
          activityLevel: Math.random() * 100,
          achievements: user.achievements.filter(a => a.game === gameProfile.name),
          stats: {
            wins: user.stats.wins,
            losses: user.stats.losses
          }
        };
      });

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      users = users.filter(user =>
        user.username.toLowerCase().includes(term) ||
        user.currentRank.toLowerCase().includes(term)
      );
    }

    // Sort by activity level
    users.sort((a, b) => b.activityLevel - a.activityLevel);

    // Calculate pagination
    const totalPages = Math.ceil(users.length / perPage);
    const start = (page - 1) * perPage;
    const paginatedUsers = users.slice(start, start + perPage);

    return {
      users: paginatedUsers,
      totalPages
    };
  }

  return { users: [], totalPages: 0 };
};

// Helper function to get a demo game by ID
export const getDemoGame = (gameId: string): GamePage | undefined => {
  return demoGames.find(game => game.id === gameId);
};