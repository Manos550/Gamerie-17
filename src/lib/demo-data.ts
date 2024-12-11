import { User } from '../types';

// Initial demo users
export let demoUsers: User[] = [
  {
    id: 'user-1',
    username: 'Manos550',
    email: 'demo@example.com',
    role: 'user',
    gamerTitle: 'Pro Gamer',
    gameLevel: 'Pro',
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80',
    bio: 'Passionate about technology and competitive gaming. Always striving for excellence and pushing the boundaries of what\'s possible in esports.',
    location: 'Athens',
    country: 'Greece',
    timezone: 'UTC+2',
    personalInfo: {
      fullName: 'Manolis Latinos',
      age: 28,
      gender: 'Male',
      location: 'Athens, Greece',
      profession: 'Software Developer'
    },
    needs: [
      {
        type: 'Looking for Team',
        game: 'Valorant',
        description: 'Seeking a competitive team for tournament play',
        active: true,
        createdAt: new Date('2024-01-15')
      }
    ],
    gamesPlayed: [
      {
        id: 'valorant',
        name: 'Valorant',
        platform: 'PC',
        skillLevel: 'Expert',
        hoursPlayed: 2000,
        rank: 'Immortal',
        nickname: 'TheHeadHunter',
        gameUsername: 'Manos550#EUW'
      },
      {
        id: 'lol',
        name: 'League of Legends',
        platform: 'PC',
        skillLevel: 'Advanced',
        hoursPlayed: 1500,
        rank: 'Diamond II',
        gameUsername: 'Manos550'
      }
    ],
    platforms: ['PC'],
    socialMedia: [
      {
        platform: 'Twitter',
        username: 'manos550',
        url: 'https://twitter.com/manos550'
      },
      {
        platform: 'Twitch',
        username: 'manos550',
        url: 'https://twitch.tv/manos550'
      }
    ],
    gamingAccounts: [
      {
        platform: 'Steam',
        username: 'manos550',
        url: 'https://steamcommunity.com/id/manos550'
      },
      {
        platform: 'Riot Games',
        username: 'Manos550#EUW',
        url: 'https://riot.com/manos550'
      }
    ],
    skills: [
      {
        name: 'Strategic Thinking',
        endorsements: [
          { userId: 'user-2', timestamp: new Date('2024-01-10') }
        ]
      },
      {
        name: 'Team Coordination',
        endorsements: [
          { userId: 'user-2', timestamp: new Date('2024-01-11') }
        ]
      }
    ],
    stats: {
      wins: 450,
      losses: 200,
      draws: 50,
      tournamentWins: 15,
      matchesPlayed: 700
    },
    followers: ['user-2', 'user-3', 'user-4'],
    following: ['user-2', 'user-3'],
    teams: [
      {
        teamId: 'team-1',
        role: 'Leader',
        joinedAt: new Date('2023-06-01')
      }
    ],
    achievements: [
      {
        id: 'achievement-1',
        title: 'Tournament Champion',
        description: 'Won the Regional Valorant Championship 2023',
        game: 'Valorant',
        date: new Date('2023-12-15'),
        proof: 'https://example.com/tournament-results'
      }
    ],
    tournaments: [
      {
        name: 'Regional Valorant Championship 2023',
        game: 'Valorant',
        date: '2023-12-15',
        placement: 1,
        totalParticipants: 32,
        prizePool: '$5,000',
        organizer: 'ESL Gaming',
        url: 'https://esl.com/tournament/123',
        status: 'completed'
      },
      {
        name: 'League of Legends Winter Cup',
        game: 'League of Legends',
        date: '2024-01-20',
        placement: 3,
        totalParticipants: 16,
        prizePool: '$2,000',
        organizer: 'Riot Games',
        url: 'https://leagueoflegends.com/tournament/456',
        status: 'completed'
      },
      {
        name: 'Valorant Masters Series',
        game: 'Valorant',
        date: '2024-02-05',
        placement: 2,
        totalParticipants: 24,
        prizePool: '$3,500',
        organizer: 'FACEIT',
        url: 'https://faceit.com/tournament/789',
        status: 'completed'
      },
      {
        name: 'Spring Valorant Championship 2024',
        game: 'Valorant',
        date: '2024-03-15',
        totalParticipants: 48,
        prizePool: '$10,000',
        organizer: 'ESL Gaming',
        url: 'https://esl.com/tournament/234',
        status: 'upcoming'
      },
      {
        name: 'League of Legends Spring Split',
        game: 'League of Legends',
        date: '2024-04-01',
        totalParticipants: 32,
        prizePool: '$7,500',
        organizer: 'Riot Games',
        url: 'https://leagueoflegends.com/tournament/567',
        status: 'upcoming'
      }
    ],
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
    isBanned: false
  },
  {
    id: 'user-2',
    username: 'NightStalker',
    email: 'nightstalker@example.com',
    role: 'user',
    gamerTitle: 'Elite Streamer',
    gameLevel: 'Pro',
    profileImage: 'https://images.unsplash.com/photo-1566411520896-01e7ca4726af?auto=format&fit=crop&q=80&w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80',
    bio: 'Professional streamer and competitive gamer. Known for aggressive playstyle and strategic decision making.',
    location: 'London',
    country: 'United Kingdom',
    timezone: 'UTC+0',
    personalInfo: {
      fullName: 'James Walker',
      age: 25,
      gender: 'Male',
      location: 'London, UK',
      profession: 'Professional Streamer'
    },
    needs: [],
    gamesPlayed: [
      {
        id: 'lol',
        name: 'League of Legends',
        platform: 'PC',
        skillLevel: 'Expert',
        hoursPlayed: 3000,
        rank: 'Master',
        nickname: 'NightStalker',
        gameUsername: 'NightStalker#EUW'
      }
    ],
    platforms: ['PC'],
    socialMedia: [
      {
        platform: 'Twitch',
        username: 'NightStalker',
        url: 'https://twitch.tv/nightstalker'
      }
    ],
    gamingAccounts: [
      {
        platform: 'Riot Games',
        username: 'NightStalker#EUW',
        url: 'https://riot.com/nightstalker'
      }
    ],
    skills: [
      {
        name: 'Mechanical Skill',
        endorsements: [
          { userId: 'user-1', timestamp: new Date('2024-01-15') }
        ]
      }
    ],
    stats: {
      wins: 600,
      losses: 300,
      draws: 30,
      tournamentWins: 8,
      matchesPlayed: 930
    },
    followers: ['user-1', 'user-3'],
    following: ['user-1', 'user-4'],
    teams: [
      {
        teamId: 'team-3',
        role: 'Leader',
        joinedAt: new Date('2023-07-01')
      }
    ],
    achievements: [
      {
        id: 'achievement-1',
        title: 'Stream Star',
        description: 'Reached 100,000 followers on Twitch',
        game: 'Multiple',
        date: new Date('2023-12-01')
      }
    ],
    tournaments: [
      {
        name: 'European League Championship Series',
        game: 'League of Legends',
        date: '2023-11-15',
        placement: 2,
        totalParticipants: 64,
        prizePool: '$15,000',
        organizer: 'Riot Games',
        url: 'https://leagueoflegends.com/tournament/890',
        status: 'completed'
      },
      {
        name: 'LEC Winter Split Qualifier',
        game: 'League of Legends',
        date: '2024-01-10',
        placement: 1,
        totalParticipants: 32,
        prizePool: '$8,000',
        organizer: 'Riot Games',
        url: 'https://leagueoflegends.com/tournament/891',
        status: 'completed'
      },
      {
        name: 'Twitch Rivals: LoL Showdown',
        game: 'League of Legends',
        date: '2024-02-20',
        placement: 3,
        totalParticipants: 16,
        prizePool: '$25,000',
        organizer: 'Twitch',
        url: 'https://twitchrivals.com/tournament/123',
        status: 'completed'
      },
      {
        name: 'LEC Spring Split 2024',
        game: 'League of Legends',
        date: '2024-03-30',
        totalParticipants: 24,
        prizePool: '$50,000',
        organizer: 'Riot Games',
        url: 'https://leagueoflegends.com/tournament/892',
        status: 'upcoming'
      }
    ],
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date(),
    isBanned: false
  },
  {
    id: 'user-3',
    username: 'SakuraPro',
    email: 'sakura@example.com',
    role: 'user',
    gamerTitle: 'Tournament Champion',
    gameLevel: 'Pro',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80',
    bio: 'Professional Dota 2 player with a passion for strategy games. Multiple tournament winner and team captain.',
    location: 'Tokyo',
    country: 'Japan',
    timezone: 'UTC+9',
    personalInfo: {
      fullName: 'Sakura Tanaka',
      age: 23,
      gender: 'Female',
      location: 'Tokyo, Japan',
      profession: 'Professional Gamer'
    },
    needs: [],
    gamesPlayed: [
      {
        id: 'dota2',
        name: 'Dota 2',
        platform: 'PC',
        skillLevel: 'Pro',
        hoursPlayed: 5000,
        rank: 'Immortal',
        nickname: 'SakuraPro',
        gameUsername: 'SakuraPro'
      }
    ],
    platforms: ['PC'],
    socialMedia: [
      {
        platform: 'Twitter',
        username: 'sakurapro',
        url: 'https://twitter.com/sakurapro'
      }
    ],
    gamingAccounts: [
      {
        platform: 'Steam',
        username: 'sakurapro',
        url: 'https://steamcommunity.com/id/sakurapro'
      }
    ],
    skills: [
      {
        name: 'Team Leadership',
        endorsements: [
          { userId: 'user-1', timestamp: new Date('2024-01-20') }
        ]
      }
    ],
    stats: {
      wins: 800,
      losses: 200,
      draws: 20,
      tournamentWins: 25,
      matchesPlayed: 1020
    },
    followers: ['user-1', 'user-2', 'user-4'],
    following: ['user-1', 'user-2'],
    teams: [
      {
        teamId: 'team-2',
        role: 'Leader',
        joinedAt: new Date('2023-05-15')
      }
    ],
    achievements: [
      {
        id: 'achievement-1',
        title: 'International Champion',
        description: 'Won the Asian Dota 2 Championship 2023',
        game: 'Dota 2',
        date: new Date('2023-11-20')
      }
    ],
    tournaments: [
      {
        name: 'The International 2023 Regional Qualifier',
        game: 'Dota 2',
        date: '2023-09-15',
        placement: 1,
        totalParticipants: 16,
        prizePool: '$50,000',
        organizer: 'Valve',
        url: 'https://dota2.com/tournament/123',
        status: 'completed'
      },
      {
        name: 'ESL One Tokyo 2023',
        game: 'Dota 2',
        date: '2023-12-10',
        placement: 2,
        totalParticipants: 12,
        prizePool: '$100,000',
        organizer: 'ESL Gaming',
        url: 'https://esl.com/tournament/456',
        status: 'completed'
      },
      {
        name: 'DreamLeague Season 22',
        game: 'Dota 2',
        date: '2024-01-25',
        placement: 1,
        totalParticipants: 8,
        prizePool: '$75,000',
        organizer: 'DreamHack',
        url: 'https://dreamhack.com/tournament/789',
        status: 'completed'
      },
      {
        name: 'Asian Games 2024 Qualifier',
        game: 'Dota 2',
        date: '2024-03-20',
        totalParticipants: 16,
        prizePool: '$200,000',
        organizer: 'Asian Games Committee',
        url: 'https://asiangames2024.com/esports',
        status: 'upcoming'
      }
    ],
    isOnline: false,
    lastSeen: new Date('2024-01-20'),
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date(),
    isBanned: false
  },
  {
    id: 'user-4',
    username: 'ArcticWolf',
    email: 'arctic@example.com',
    role: 'user',
    gamerTitle: 'Rising Star',
    gameLevel: 'Advanced',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    backgroundImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80',
    bio: 'CS2 enthusiast and upcoming talent. Focused on becoming a professional player and improving every day.',
    location: 'Stockholm',
    country: 'Sweden',
    timezone: 'UTC+1',
    personalInfo: {
      fullName: 'Erik Andersson',
      age: 19,
      gender: 'Male',
      location: 'Stockholm, Sweden',
      profession: 'Student'
    },
    needs: [],
    gamesPlayed: [
      {
        id: 'cs2',
        name: 'Counter-Strike 2',
        platform: 'PC',
        skillLevel: 'Advanced',
        hoursPlayed: 2500,
        rank: 'Global Elite',
        nickname: 'ArcticWolf',
        gameUsername: 'ArcticWolf'
      }
    ],
    platforms: ['PC'],
    socialMedia: [
      {
        platform: 'Twitter',
        username: 'arcticwolf_cs',
        url: 'https://twitter.com/arcticwolf_cs'
      }
    ],
    gamingAccounts: [
      {
        platform: 'Steam',
        username: 'arcticwolf',
        url: 'https://steamcommunity.com/id/arcticwolf'
      }
    ],
    skills: [
      {
        name: 'Aim Precision',
        endorsements: [
          { userId: 'user-2', timestamp: new Date('2024-01-19') }
        ]
      }
    ],
    stats: {
      wins: 300,
      losses: 150,
      draws: 25,
      tournamentWins: 2,
      matchesPlayed: 475
    },
    followers: ['user-2'],
    following: ['user-1', 'user-2', 'user-3'],
    teams: [],
    achievements: [
      {
        id: 'achievement-1',
        title: 'Regional Finalist',
        description: 'Runner-up in Nordic CS2 Championship 2023',
        game: 'Counter-Strike 2',
        date: new Date('2023-12-10')
      }
    ],
    tournaments: [
      {
        name: 'Nordic CS2 Championship 2023',
        game: 'Counter-Strike 2',
        date: '2023-12-10',
        placement: 2,
        totalParticipants: 32,
        prizePool: '$10,000',
        organizer: 'Nordic Esports League',
        url: 'https://nel.gg/tournament/123',
        status: 'completed'
      },
      {
        name: 'FACEIT Pro League EU',
        game: 'Counter-Strike 2',
        date: '2024-01-15',
        placement: 4,
        totalParticipants: 20,
        prizePool: '$5,000',
        organizer: 'FACEIT',
        url: 'https://faceit.com/tournament/456',
        status: 'completed'
      },
      {
        name: 'ESL Challenger Stockholm',
        game: 'Counter-Strike 2',
        date: '2024-02-08',
        placement: 3,
        totalParticipants: 16,
        prizePool: '$15,000',
        organizer: 'ESL Gaming',
        url: 'https://esl.com/tournament/789',
        status: 'completed'
      },
      {
        name: 'BLAST Premier Spring Showdown',
        game: 'Counter-Strike 2',
        date: '2024-04-10',
        totalParticipants: 24,
        prizePool: '$30,000',
        organizer: 'BLAST',
        url: 'https://blastpremier.com/tournament/234',
        status: 'upcoming'
      }
    ],
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date(),
    isBanned: false
  }
];

// Helper function to get a demo user by ID
export const getDemoUser = (userId: string): User | undefined => {
  return demoUsers.find(user => user.id === userId);
};

// Helper function to update a demo user
export const updateDemoUser = (userId: string, updates: Partial<User>): void => {
  const userIndex = demoUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    demoUsers[userIndex] = {
      ...demoUsers[userIndex],
      ...updates,
      updatedAt: new Date()
    };
  }
};