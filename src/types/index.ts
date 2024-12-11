// Add these types to your existing types file

export interface UserSettings {
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showOnlineStatus: boolean;
    showGameActivity: boolean;
    allowFriendRequests: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    matchReminders: boolean;
    teamUpdates: boolean;
    friendActivity: boolean;
    marketingEmails: boolean;
  };
  language: string;
  timezone: string;
}

// Update User interface to include settings
export interface User {
  // ... existing User properties ...
  settings?: UserSettings;
}