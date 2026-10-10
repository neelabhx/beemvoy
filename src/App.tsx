import React, { useState, useEffect } from 'react';
import { MobileViewportFrame } from './components/MobileViewportFrame';
import { BottomNav, NavTab } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { FlightsScreen } from './components/FlightsScreen';
import { HotelsScreen } from './components/HotelsScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { ItineraryScreen } from './components/ItineraryScreen';
import { TravelScreen } from './components/TravelScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CanonicalTrip, FlightItem, HotelItem, ActivityItem, UserProfile } from './types';
import mockDataset from './data/mock-data.json';
import { supabase } from './lib/supabase';

export default function App() {
  // Check active session on boot: default to false if no session found
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem('beemvoy_session');
      return Boolean(session);
    } catch (e) {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [subView, setSubView] = useState<'flights' | 'hotels' | null>(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('beemvoy_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'usr-1',
      name: 'Sara Jenkins',
      email: 'sara.jenkins@voyage.io',
      phone: '+91 98765 43210',
      membershipTier: 'Beemvoy Elite Pioneer',
      pacing: 'balanced',
      budgetTier: 'comfort',
      interests: ['Mountain Treks', 'Tea Plantations', 'Heritage'],
    };
  });

  // Single Canonical Trip State preserved across all transitions
  const [canonicalTrip, setCanonicalTrip] = useState<CanonicalTrip>(() => {
    const saved = localStorage.getItem('beemvoy_active_trip');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'trip-munnar-1',
      title: '5-Day Munnar High Ridge Expedition',
      destination: 'Munnar',
      origin: 'BLR',
      days: 3,
      dates: 'Fri 10 Oct - Sun 12 Oct 2026',
      status: 'configuring',
      budget_total_inr: 30000,
      selected_flight: (mockDataset.flights[0] as FlightItem) || null,
      selected_hotel: (mockDataset.hotels[0] as HotelItem) || null,
      selected_activities: [mockDataset.activities[0] as ActivityItem],
      itinerary_days: mockDataset.itinerary_days as any,
      created_at: new Date().toISOString(),
    };
  });

  // Check Supabase session on boot & listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        localStorage.setItem(
          'beemvoy_session',
          JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || 'Sara Jenkins',
            timestamp: Date.now(),
          })
        );
        setIsAuthenticated(true);
        setUserProfile((prev) => ({
          ...prev,
          email: session.user.email || prev.email,
          name: session.user.user_metadata?.full_name || prev.name,
        }));
      }
    }).catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        localStorage.setItem(
          'beemvoy_session',
          JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || 'Sara Jenkins',
            timestamp: Date.now(),
          })
        );
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Persist canonical trip updates
  useEffect(() => {
    localStorage.setItem('beemvoy_active_trip', JSON.stringify(canonicalTrip));
  }, [canonicalTrip]);

  // Handle Authentication completion (transitions from AUTH-02 to HOME)
  const handleAuthComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    setCurrentTab('HOME');
    setSubView(null);
  };

  // Sign Out Handler: Clears session and returns user to AUTH-01
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('beemvoy_session');
    setIsAuthenticated(false);
    setCurrentTab('HOME');
    setSubView(null);
  };

  // Tab change handler
  const handleTabChange = (tab: NavTab) => {
    setSubView(null);
    setCurrentTab(tab);
  };

  // Flight Selection
  const handleSelectFlight = (flight: FlightItem) => {
    setCanonicalTrip((prev) => ({
      ...prev,
      selected_flight: flight,
    }));
  };

  // Hotel Selection
  const handleSelectHotel = (hotel: HotelItem) => {
    setCanonicalTrip((prev) => ({
      ...prev,
      selected_hotel: hotel,
    }));
  };

  // Activity Toggle
  const handleToggleActivity = (activity: ActivityItem) => {
    setCanonicalTrip((prev) => {
      const exists = prev.selected_activities.some((a) => a.id === activity.id);
      const updated = exists
        ? prev.selected_activities.filter((a) => a.id !== activity.id)
        : [...prev.selected_activities, activity];
      return {
        ...prev,
        selected_activities: updated,
      };
    });
  };

  // Profile Update
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('beemvoy_profile', JSON.stringify(updated));
  };

  return (
    <MobileViewportFrame>
      {!isAuthenticated ? (
        /* AUTH-01 / AUTH-02 Screen rendered immediately when unauthenticated without bottom nav */
        <AuthScreen onComplete={handleAuthComplete} />
      ) : (
        /* Authenticated View: 5 Tabs and Subviews */
        <div className="relative w-full h-full">
          {subView === 'flights' ? (
            <FlightsScreen
              trip={canonicalTrip}
              onSelectFlight={handleSelectFlight}
              onContinueToHotels={() => setSubView('hotels')}
              onBack={() => setSubView(null)}
            />
          ) : subView === 'hotels' ? (
            <HotelsScreen
              trip={canonicalTrip}
              onSelectHotel={handleSelectHotel}
              onContinueToActivities={() => {
                setSubView(null);
                setCurrentTab('MY TRIP');
              }}
              onBack={() => setSubView('flights')}
            />
          ) : (
            <>
              {currentTab === 'HOME' && (
                <HomeScreen
                  trip={canonicalTrip}
                  user={userProfile}
                  onUpdateTrip={setCanonicalTrip}
                  onNavigateToTab={handleTabChange}
                  onOpenFlights={() => setSubView('flights')}
                  onOpenHotels={() => setSubView('hotels')}
                />
              )}

              {currentTab === 'EXPLORE' && (
                <ExploreScreen
                  trip={canonicalTrip}
                  onToggleActivity={handleToggleActivity}
                  onViewItinerary={() => handleTabChange('MY TRIP')}
                />
              )}

              {currentTab === 'MY TRIP' && (
                <ItineraryScreen
                  trip={canonicalTrip}
                  onExploreMore={() => handleTabChange('EXPLORE')}
                  onBookTravel={() => handleTabChange('TRAVEL')}
                />
              )}

              {currentTab === 'TRAVEL' && (
                <TravelScreen trip={canonicalTrip} />
              )}

              {currentTab === 'PROFILE' && (
                <ProfileScreen
                  user={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onSignOut={handleSignOut}
                />
              )}
            </>
          )}

          {/* 5 Bottom Navigation Tabs (rendered only in authenticated state) */}
          <BottomNav
            currentTab={currentTab}
            onTabChange={handleTabChange}
            tripItemCount={
              canonicalTrip.selected_activities.length +
              (canonicalTrip.selected_flight ? 1 : 0) +
              (canonicalTrip.selected_hotel ? 1 : 0)
            }
          />
        </div>
      )}
    </MobileViewportFrame>
  );
}
