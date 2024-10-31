export interface CheckAvailabilityRequest {
    resourceTypeId: number;
    quantityRequested: number;
    startTime: string; // ISO string
    endTime: string; // ISO string
  }
  
  export interface CheckAvailabilityResponse {
    isAvailable: boolean;
  }