export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export interface UserStats {
  totalLandmarks: number;
  totalRoutes: number;
  lastActive: string;
}