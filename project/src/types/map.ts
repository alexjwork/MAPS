export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  location: Coordinates;
  type: LandmarkType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export type LandmarkType = 'restaurant' | 'attraction' | 'hotel' | 'park' | 'shop' | 'other';

export interface Route {
  id: string;
  name: string;
  description: string;
  points: Coordinates[];
  color: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MapFilters {
  types?: LandmarkType[];
  search?: string;
  createdBy?: string;
}