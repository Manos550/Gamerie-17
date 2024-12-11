import { GamePage } from '../types';

// Demo game pages with enhanced content
const demoGames: GamePage[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    wallPhoto: 'https://www.counter-strike.net/static/images/cs2/cs2_header.jpg',
    description: 'Counter-Strike 2 is the largest technical leap forward in Counter-Strike history.',
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
  },
  {
    id: 'lol',
    name: 'League of Legends',
    wallPhoto: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    description: 'Team up with friends and test your skills in 5v5 MOBA combat.',
    company: 'Riot Games',
    gameType: 'Multiplayer Online Battle Arena (MOBA)',
    gameModes: [
      'Classic 5v5',
      'ARAM',
      'Team Fight Tactics',
      'Rotating Game Modes'
    ],
    requiredSkills: [
      'Strategic thinking',
      'Map awareness',
      'Team coordination',
      'Resource management',
      'Quick decision making',
      'Champion mastery'
    ],
    followers: [],
    teams: [],
    platforms: ['PC'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/LeagueOfLegends' },
      { platform: 'Instagram', url: 'https://instagram.com/leagueoflegends' },
      { platform: 'YouTube', url: 'https://youtube.com/leagueoflegends' }
    ],
    officialWebsite: 'https://www.leagueoflegends.com',
    followers_stats: {
      total: 2500000,
      active_gamers: 1800000,
      streamers: 500000,
      spectators: 200000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'valorant',
    name: 'Valorant',
    wallPhoto: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt714eaee50b90af67/62cc7dcc6a8fb133b0ff7e55/VALORANT_EPISODE5_ACT1_SOCIAL_CARDS_1920x1080.jpg',
    description: 'A 5v5 character-based tactical shooter.',
    company: 'Riot Games',
    gameType: 'Tactical First-Person Shooter (FPS)',
    gameModes: [
      'Unrated',
      'Competitive',
      'Spike Rush',
      'Deathmatch',
      'Custom Games'
    ],
    requiredSkills: [
      'Aim precision',
      'Game sense',
      'Team communication',
      'Ability usage',
      'Economy management',
      'Map knowledge'
    ],
    followers: [],
    teams: [],
    platforms: ['PC'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/PlayVALORANT' },
      { platform: 'Instagram', url: 'https://instagram.com/playvalorantofficial' },
      { platform: 'YouTube', url: 'https://youtube.com/PlayValorant' }
    ],
    officialWebsite: 'https://playvalorant.com',
    followers_stats: {
      total: 1800000,
      active_gamers: 1200000,
      streamers: 400000,
      spectators: 200000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    wallPhoto: 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg',
    description: 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.',
    company: 'Valve Corporation',
    gameType: 'Multiplayer Online Battle Arena (MOBA)',
    gameModes: [
      'All Pick',
      'Captains Mode',
      'Random Draft',
      'Turbo',
      'Custom Games'
    ],
    requiredSkills: [
      'Mechanical skill',
      'Game knowledge',
      'Team coordination',
      'Resource management',
      'Map awareness',
      'Hero countering'
    ],
    followers: [],
    teams: [],
    platforms: ['PC'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/DOTA2' },
      { platform: 'YouTube', url: 'https://youtube.com/dota2' }
    ],
    officialWebsite: 'https://www.dota2.com',
    followers_stats: {
      total: 2000000,
      active_gamers: 1500000,
      streamers: 300000,
      spectators: 200000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'fifa',
    name: 'EA SPORTS FC 24',
    wallPhoto: 'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/common/featured-image/fc24-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg',
    description: 'Experience the next evolution of The Worlds Game with EA SPORTS FC 24.',
    company: 'Electronic Arts',
    gameType: 'Sports Simulation',
    gameModes: [
      'Career Mode',
      'Ultimate Team',
      'Pro Clubs',
      'VOLTA FOOTBALL',
      'Online Seasons'
    ],
    requiredSkills: [
      'Ball control',
      'Tactical awareness',
      'Team management',
      'Quick reflexes',
      'Strategy planning',
      'Formation knowledge'
    ],
    followers: [],
    teams: [],
    platforms: ['PC', 'PS5', 'XBOX', 'Switch'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/EASPORTSFC' },
      { platform: 'Instagram', url: 'https://instagram.com/easportsfc' },
      { platform: 'YouTube', url: 'https://youtube.com/easports' }
    ],
    officialWebsite: 'https://www.ea.com/games/fc/fc-24',
    followers_stats: {
      total: 3000000,
      active_gamers: 2200000,
      streamers: 250000,
      spectators: 550000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cod',
    name: 'Call of Duty',
    wallPhoto: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mwiii/MWIII-REVEAL-FULL-TOUT.jpg',
    description: 'Experience the thrill of modern warfare in this iconic first-person shooter series.',
    company: 'Activision',
    gameType: 'First-Person Shooter (FPS)',
    gameModes: [
      'Campaign',
      'Multiplayer',
      'Warzone',
      'Zombies',
      'Special Ops'
    ],
    requiredSkills: [
      'Aim accuracy',
      'Map knowledge',
      'Movement mechanics',
      'Team coordination',
      'Weapon mastery',
      'Strategic positioning'
    ],
    followers: [],
    teams: [],
    platforms: ['PC', 'PS5', 'XBOX'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/CallofDuty' },
      { platform: 'Instagram', url: 'https://instagram.com/callofduty' },
      { platform: 'YouTube', url: 'https://youtube.com/callofduty' }
    ],
    officialWebsite: 'https://www.callofduty.com',
    followers_stats: {
      total: 4000000,
      active_gamers: 2800000,
      streamers: 600000,
      spectators: 600000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'wow',
    name: 'World of Warcraft',
    wallPhoto: 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/2g/2G4ZWRSBYEQM1602720144046.jpg',
    description: 'Join millions of players in this epic MMORPG set in the vast realm of Azeroth.',
    company: 'Blizzard Entertainment',
    gameType: 'Massively Multiplayer Online Role-Playing Game (MMORPG)',
    gameModes: [
      'Player vs Environment (PvE)',
      'Player vs Player (PvP)',
      'Raids',
      'Dungeons',
      'Battlegrounds',
      'Arena'
    ],
    requiredSkills: [
      'Character optimization',
      'Raid awareness',
      'Role mastery',
      'Resource management',
      'Team coordination',
      'Situational awareness'
    ],
    followers: [],
    teams: [],
    platforms: ['PC'],
    socialMedia: [
      { platform: 'Twitter', url: 'https://twitter.com/Warcraft' },
      { platform: 'Instagram', url: 'https://instagram.com/warcraft' },
      { platform: 'YouTube', url: 'https://youtube.com/worldofwarcraft' }
    ],
    officialWebsite: 'https://worldofwarcraft.blizzard.com',
    followers_stats: {
      total: 2800000,
      active_gamers: 1900000,
      streamers: 350000,
      spectators: 550000
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const search = async (query: string) => {
  const isDemoMode = import.meta.env.MODE === 'development';
  const searchTerm = query.toLowerCase();

  if (isDemoMode) {
    // Search in demo data
    const filteredGames = demoGames.filter(game =>
      game.name.toLowerCase().includes(searchTerm) ||
      game.description.toLowerCase().includes(searchTerm)
    );

    return {
      users: [],
      teams: [],
      games: filteredGames
    };
  }

  // Firebase search implementation would go here
  return { users: [], teams: [], games: [] };
};

// Helper function to get a demo game by ID
export const getDemoGame = (gameId: string): GamePage | undefined => {
  return demoGames.find(game => game.id === gameId);
};