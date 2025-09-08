'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Authenticated users will be redirected to dashboard
  if (user) {
    return null; // Will redirect via useEffect
  }

  // Show landing page for unauthenticated users
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Weight Tracker ⚖️
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track progress, reach your goals
        </p>
        
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Start Your Journey</h2>
          <p className="text-muted-foreground mb-6">
            Set weight goals, track daily progress, and visualize your success with interactive charts and progress tracking.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-4">
            <h3 className="font-semibold mb-2">🎯 Set Goals</h3>
            <p className="text-sm text-muted-foreground">
              Define your target weight and deadline with daily progress tracking.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">📊 Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your journey with animated charts and moving averages.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">🔄 Stay Consistent</h3>
            <p className="text-sm text-muted-foreground">
              Build logging streaks and get reminders to stay on track.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}