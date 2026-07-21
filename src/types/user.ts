export interface VinciUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  createdAt: string;
}

export interface UserSettings {
  theme: "dark" | "light";
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketAlerts: boolean;
  memoryEnabled: boolean;
  dataSharingAnalytics: boolean;
  preferredLanguage: string;
}

export interface NotificationItem {
  id: string;
  type:
    | "MEMORY_UPDATE"
    | "DNA_UPDATE"
    | "ACHIEVEMENT_UNLOCKED"
    | "MARKET_ALERT"
    | "AUTHENTICITY_ALERT"
    | "SYSTEM";
  title: string;
  body: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}
