'use client';

import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Dumbbell, Apple, TrendingUp } from "lucide-react"
import { useClientActivities } from '@/lib/hooks/api/useProgress';
import { useAuthStore } from '@/lib/store/auth.store';
import { useUserStore } from '@/lib/store/user.store';

/**
 * Client Dashboard Page
 * Follows Architecture Rules:
 * - Rule 1: Component calls hooks only
 * - Uses React Query for server data
 * - Uses Zustand for user state
 */
export default function ClientDashboardPage() {
  const { user } = useUserStore();
  const { data: activitiesData, isLoading } = useClientActivities(user?.id || '', { limit: 10 });

  const workoutsThisWeek = activitiesData?.summary.workouts || 0;
  const mealsLogged = activitiesData?.summary.nutritionLogs || 0;
  const recentActivities = activitiesData?.activities.slice(0, 4) || [];
  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Welcome back, {user?.name || 'Client'}!</h1>
          <p className="text-muted-foreground">Here's your fitness progress overview</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : workoutsThisWeek}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,240</div>
              <p className="text-xs text-muted-foreground">+15% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals Logged</CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : mealsLogged}</div>
              <p className="text-xs text-muted-foreground">6 days tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">4:00 PM - Strength Training</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Weight Loss Goal</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">7.5 lbs lost of 10 lbs goal</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Workout Consistency</span>
                  <span className="text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">23 of 25 workouts completed</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Nutrition Tracking</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">6 of 7 days logged</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading activities...</div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {activity.type === 'workout' ? 'Completed' : 
                       activity.type === 'nutrition' ? 'Logged' : 'Updated'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No recent activity</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
