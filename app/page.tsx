'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUpIcon, TargetIcon, BarChartIcon, CheckCircleIcon, ScaleIcon, CalendarIcon } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Authenticated users will be redirected to dashboard
  if (user) {
    return null; // Will redirect via useEffect
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <ScaleIcon className="w-3 h-3 mr-1" />
            Modern Weight Tracking
          </Badge>
          
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Transform Your
            <span className="text-primary"> Weight Journey</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Set ambitious goals, track daily progress, and visualize your transformation with beautiful charts and intelligent insights.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/auth/signup">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <TargetIcon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Smart Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set realistic targets with deadline tracking and intelligent daily progress calculations.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <BarChartIcon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Visual Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive charts with moving averages, trends, and progress visualization to keep you motivated.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <TrendingUpIcon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor daily changes, build streaks, and celebrate milestones with detailed progress insights.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Daily Logging</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Quick and easy weight entry with memo support and automatic averaging for multiple daily entries.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <CheckCircleIcon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Real-time Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Access your data anywhere with automatic synchronization across all your devices.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-primary/20">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                <ScaleIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">Modern Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beautiful, responsive interface that makes tracking your weight a delightful experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="max-w-3xl mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Transformation?</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Join thousands of users who have successfully reached their weight goals with our intuitive tracking platform.
            </p>
            <Separator className="my-6" />
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/auth/signup">Create Free Account</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-base px-8">
                <Link href="/auth/login">Already have an account?</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}