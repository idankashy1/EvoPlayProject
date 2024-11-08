export interface User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    city?: string;
    address?: string;
    totalPoints: number;
    currentPoints: number;
    availableRewards: number;
    role: string; // "User" או "Admin"
  }