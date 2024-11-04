// src/app/models/booking.model.ts
export interface Booking {
    BookingGroup: any;
    id: number;
    firstName: string;
    lastName: string;
    roomName: string;
    numberOfPlayers: number;
    startTime: string; // ISO string
    endTime: string; // ISO string
    phoneNumber: string;
    availableRewards: number;
}