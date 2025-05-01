import { Landmark, Route, LandmarkType } from '../types/map';

// Mock landmarks
export const mockLandmarks: Landmark[] = [
  {
    id: 'landmark-1',
    name: 'Central Park',
    description: 'A beautiful park in the heart of the city with walking trails and a lake.',
    location: { lat: 51.505, lng: -0.09 },
    type: 'park',
    createdBy: '1',
    createdAt: '2023-05-10T12:00:00Z',
    updatedAt: '2023-05-10T12:00:00Z'
  },
  {
    id: 'landmark-2',
    name: 'City Museum',
    description: 'Museum showcasing the history and culture of the city.',
    location: { lat: 51.507, lng: -0.10 },
    type: 'attraction',
    createdBy: '1',
    createdAt: '2023-05-12T10:30:00Z',
    updatedAt: '2023-05-12T10:30:00Z'
  },
  {
    id: 'landmark-3',
    name: 'Harbor Restaurant',
    description: 'Fine dining with a view of the harbor. Specializes in seafood.',
    location: { lat: 51.503, lng: -0.11 },
    type: 'restaurant',
    createdBy: '2',
    createdAt: '2023-05-15T18:45:00Z',
    updatedAt: '2023-05-15T18:45:00Z'
  },
  {
    id: 'landmark-4',
    name: 'Grand Hotel',
    description: 'Luxury hotel with 5-star amenities and a rooftop pool.',
    location: { lat: 51.501, lng: -0.08 },
    type: 'hotel',
    createdBy: '2',
    createdAt: '2023-05-18T14:20:00Z',
    updatedAt: '2023-05-18T14:20:00Z'
  },
  {
    id: 'landmark-5',
    name: 'Artisan Café',
    description: 'Cozy café serving specialty coffee and homemade pastries.',
    location: { lat: 51.509, lng: -0.085 },
    type: 'restaurant',
    createdBy: '1',
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-05-20T09:15:00Z'
  },
  {
    id: 'landmark-6',
    name: 'Shopping Center',
    description: 'Large mall with a variety of stores, restaurants, and entertainment options.',
    location: { lat: 51.504, lng: -0.095 },
    type: 'shop',
    createdBy: '3',
    createdAt: '2023-05-22T11:30:00Z',
    updatedAt: '2023-05-22T11:30:00Z',
    isFlagged: true,
    flagReason: 'Inaccurate location information'
  }
];

// Mock routes
export const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Downtown Tour',
    description: 'A scenic walk through the downtown area, visiting key landmarks.',
    points: [
      { lat: 51.505, lng: -0.09 },
      { lat: 51.507, lng: -0.10 },
      { lat: 51.503, lng: -0.11 },
      { lat: 51.501, lng: -0.08 }
    ],
    color: '#3B82F6',
    createdBy: '1',
    createdAt: '2023-05-25T15:00:00Z',
    updatedAt: '2023-05-25T15:00:00Z'
  },
  {
    id: 'route-2',
    name: 'Cultural Walk',
    description: 'A route connecting cultural landmarks and museums.',
    points: [
      { lat: 51.507, lng: -0.10 },
      { lat: 51.509, lng: -0.11 },
      { lat: 51.511, lng: -0.105 },
      { lat: 51.510, lng: -0.095 }
    ],
    color: '#10B981',
    createdBy: '2',
    createdAt: '2023-05-28T10:15:00Z',
    updatedAt: '2023-05-28T10:15:00Z'
  },
  {
    id: 'route-3',
    name: 'Food Tour',
    description: 'Visit the best restaurants and cafés in the area.',
    points: [
      { lat: 51.503, lng: -0.11 },
      { lat: 51.509, lng: -0.085 },
      { lat: 51.506, lng: -0.08 },
      { lat: 51.502, lng: -0.09 }
    ],
    color: '#EF4444',
    createdBy: '1',
    createdAt: '2023-06-01T12:30:00Z',
    updatedAt: '2023-06-01T12:30:00Z'
  }
];