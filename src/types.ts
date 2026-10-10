export interface TripIntent {
  destination: string;
  origin: string | null;
  duration_days: number;
  start_date: string | null;
  end_date: string | null;
  budget_total_inr: number | null;
  travellers: number;
  interests: string[];
  travel_pace: 'relaxed' | 'balanced' | 'fast-paced';
  missing_fields: string[];
  assumptions: string[];
}

export interface FlightItem {
  id: string;
  airline: string;
  flight_number: string;
  origin: string;
  origin_city: string;
  destination: string;
  destination_city: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  price: string;
  price_raw: number;
  badge: string;
  tagline?: string;
  note?: string;
}

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  distance?: string;
  rating: number;
  reviews_count: number;
  price_per_night: string;
  price_per_night_raw: number;
  nights: number;
  total_price: string;
  amenities: string[];
  image_key?: string;
  badge?: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  recommended_time?: string;
  day: number;
  price: string;
  price_raw: number;
  rating?: number;
  reviews_count?: number;
  image_key?: string;
  experience?: string;
  practical_logistics?: string[];
  field_note?: string;
  synergy?: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  subtitle: string;
  type: 'flight' | 'transit' | 'hotel' | 'activity' | 'food' | 'relaxation';
  badge?: string;
  details?: string;
  activity_id?: string;
  has_media?: boolean;
  visited?: boolean;
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  date_label: string;
  summary: string;
  activities: TimelineEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  membershipTier: string;
  pacing: 'relaxed' | 'balanced' | 'fast-paced';
  budgetTier: 'economy' | 'comfort' | 'luxury';
  interests: string[];
}

export interface CanonicalTrip {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  days: number;
  dates: string;
  status: 'draft' | 'configuring' | 'locked' | 'booked';
  budget_total_inr: number;
  selected_flight: FlightItem | null;
  selected_hotel: HotelItem | null;
  selected_activities: ActivityItem[];
  itinerary_days: ItineraryDay[];
  created_at: string;
}
