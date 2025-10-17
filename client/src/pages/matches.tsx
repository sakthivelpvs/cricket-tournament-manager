import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Play } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Match, Team } from "@shared/schema";

export default function Matches() {
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const getTeamName = (id: number | null) => {
    if (!id || !teams) return "Unknown";
    return teams.find(t => t.id === id)?.name || "Unknown";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-chart-3 text-white">Live</Badge>;
      case "abandoned":
        return <Badge variant="destructive">Abandoned</Badge>;
      default:
        return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground mt-2">
            View and manage matches
          </p>
        </div>
        <Link href="/matches/create">
          <Button data-testid="button-create-match">
            <Plus className="mr-2 h-4 w-4" />
            Create Match
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : matches && matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} data-testid={`card-match-${match.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge>{match.stage}</Badge>
                      {getStatusBadge(match.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-lg">{getTeamName(match.team1Id)}</p>
                        {match.status === "completed" || match.status === "in_progress" ? (
                          <p className="text-sm font-mono text-muted-foreground">
                            {match.team1Score}/{match.team1Wickets} ({match.team1Overs || 0})
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{getTeamName(match.team2Id)}</p>
                        {match.status === "completed" || match.status === "in_progress" ? (
                          <p className="text-sm font-mono text-muted-foreground">
                            {match.team2Score}/{match.team2Wickets} ({match.team2Overs || 0})
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {match.status === "completed" && match.result && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        {match.result === "team1_win"
                          ? `${getTeamName(match.team1Id)} won`
                          : match.result === "team2_win"
                          ? `${getTeamName(match.team2Id)} won`
                          : match.result === "tie"
                          ? "Match tied"
                          : "Match abandoned"}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {match.status !== "completed" && match.status !== "abandoned" && (
                      <Link href={`/matches/${match.id}/score`}>
                        <Button size="sm" data-testid={`button-score-${match.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          {match.status === "in_progress" ? "Continue" : "Start"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <Play className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">No matches yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first match to get started
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
