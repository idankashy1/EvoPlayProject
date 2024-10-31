export interface BookingRequestDto {
    totalCost: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    city?: string;
    address?: string;
    resourceTypeId: number;
    quantity: number;
    startTime: string; // ISO string
    endTime: string; // ISO string
    numberOfPlayers: number;
    packageId?: number;
  }