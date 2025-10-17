import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Target, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const statCards = [
    {
      title: "Total Tournaments",
      value: stats?.tournaments || 0,
      icon: Trophy,
      color: "text-primary",
      testId: "stat-tournaments",
    },
    {
      title: "Active Teams",
      value: stats?.teams || 0,
      icon: Users,
      color: "text-chart-2",
      testId: "stat-teams",
    },
    {
      title: "Matches Played",
      value: stats?.matches || 0,
      icon: Target,
      color: "text-chart-3",
      testId: "stat-matches",
    },
    {
      title: "Total Players",
      value: stats?.players || 0,
      icon: TrendingUp,
      color: "text-chart-4",
      testId: "stat-players",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Cricket Tournament Manager
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold font-mono">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : stats?.recentMatches?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentMatches.map((match: any) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{match.team1} vs {match.team2}</p>
                      <p className="text-sm text-muted-foreground">{match.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">{match.score || "Upcoming"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent matches
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/tournaments" className="block">
              <div className="p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer">
                <h3 className="font-medium">Create Tournament</h3>
                <p className="text-sm text-muted-foreground">
                  Start a new cricket tournament
                </p>
              </div>
            </a>
            <a href="/teams" className="block">
              <div className="p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer">
                <h3 className="font-medium">Add Team</h3>
                <p className="text-sm text-muted-foreground">
                  Register a new team
                </p>
              </div>
            </a>
            <a href="/matches" className="block">
              <div className="p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer">
                <h3 className="font-medium">Schedule Match</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new match
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
