import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Undo2, Check } from "lucide-react";
import { Link } from "wouter";
import type { Match, Team } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MatchScore() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [superOverDialogOpen, setSuperOverDialogOpen] = useState(false);
  const [superOverData, setSuperOverData] = useState({
    team1Runs: 0,
    team1Wickets: 0,
    team2Runs: 0,
    team2Wickets: 0,
  });

  const { data: match, isLoading } = useQuery<Match>({
    queryKey: ["/api/matches", id],
  });

  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const scoreBallMutation = useMutation({
    mutationFn: (data: { runs: number; extras?: string; isWicket?: boolean }) =>
      apiRequest("POST", `/api/matches/${id}/score`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches", id] });
    },
  });

  const undoBallMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/matches/${id}/undo`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches", id] });
      toast({ title: "Last ball undone" });
    },
  });

  const completeSuperOverMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/matches/${id}/super-over`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches", id] });
      setSuperOverDialogOpen(false);
      toast({ title: "Super Over completed" });
      setLocation("/matches");
    },
  });

  const getTeamName = (teamId: number | null) => {
    if (!teamId || !teams) return "Unknown";
    return teams.find(t => t.id === teamId)?.name || "Unknown";
  };

  const handleScoreRuns = (runs: number, extras?: string) => {
    scoreBallMutation.mutate({ runs, extras });
  };

  const handleWicket = () => {
    scoreBallMutation.mutate({ runs: 0, isWicket: true });
  };

  const handleSuperOverSubmit = () => {
    completeSuperOverMutation.mutate(superOverData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!match) {
    return <div>Match not found</div>;
  }

  const currentBattingTeamId = match.currentBattingTeamId || match.battingFirstId || match.team1Id;
  const isTeam1Batting = currentBattingTeamId === match.team1Id;
  const currentScore = isTeam1Batting ? match.team1Score : match.team2Score;
  const currentWickets = isTeam1Batting ? match.team1Wickets : match.team2Wickets;
  const currentOvers = isTeam1Batting ? match.team1Overs : match.team2Overs;

  const showSuperOverPrompt = match.status === "completed" && match.result === "tie";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/matches">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Live Scoring</h1>
          <p className="text-muted-foreground mt-1">{match.stage}</p>
        </div>
        <Badge className="bg-chart-3 text-white">
          {match.status === "in_progress" ? "Live" : match.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className={isTeam1Batting ? "ring-2 ring-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getTeamName(match.team1Id)}</span>
              {isTeam1Batting && <Badge variant="secondary">Batting</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              {match.team1Score}/{match.team1Wickets}
            </div>
            <div className="text-muted-foreground mt-1">
              Overs: {match.team1Overs || "0.0"}
            </div>
          </CardContent>
        </Card>

        <Card className={!isTeam1Batting ? "ring-2 ring-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getTeamName(match.team2Id)}</span>
              {!isTeam1Batting && <Badge variant="secondary">Batting</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              {match.team2Score}/{match.team2Wickets}
            </div>
            <div className="text-muted-foreground mt-1">
              Overs: {match.team2Overs || "0.0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {match.status !== "completed" && (
        <Card>
          <CardHeader>
            <CardTitle>Score Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Runs</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleScoreRuns(1)}
                  data-testid="button-run-1"
                  className="h-16 text-lg font-semibold"
                >
                  1
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleScoreRuns(2)}
                  data-testid="button-run-2"
                  className="h-16 text-lg font-semibold"
                >
                  2
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleScoreRuns(3)}
                  data-testid="button-run-3"
                  className="h-16 text-lg font-semibold"
                >
                  3
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleScoreRuns(4)}
                  data-testid="button-run-4"
                  className="h-16 text-lg font-semibold bg-primary/10"
                >
                  4
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleScoreRuns(6)}
                  data-testid="button-run-6"
                  className="h-16 text-lg font-semibold bg-primary/10"
                >
                  6
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleWicket}
                  data-testid="button-wicket"
                  className="h-16 text-lg font-semibold"
                >
                  W
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Extras</h3>
              <div className="grid grid-cols-4 gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleScoreRuns(1, "wide")}
                  data-testid="button-wide"
                >
                  Wide
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleScoreRuns(1, "no-ball")}
                  data-testid="button-no-ball"
                >
                  No Ball
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleScoreRuns(1, "bye")}
                  data-testid="button-bye"
                >
                  Bye
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleScoreRuns(1, "leg-bye")}
                  data-testid="button-leg-bye"
                >
                  Leg Bye
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => undoBallMutation.mutate()}
                disabled={undoBallMutation.isPending}
                data-testid="button-undo"
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Undo Last Ball
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showSuperOverPrompt && (
        <Card className="border-chart-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="bg-chart-3 text-white">Super Over Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The match is tied. Please enter Super Over details.</p>
            <Button onClick={() => setSuperOverDialogOpen(true)} data-testid="button-enter-super-over">
              Enter Super Over Results
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={superOverDialogOpen} onOpenChange={setSuperOverDialogOpen}>
        <DialogContent data-testid="dialog-super-over">
          <DialogHeader>
            <DialogTitle>Super Over Results</DialogTitle>
            <DialogDescription>
              Enter the Super Over results to determine the winner
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{getTeamName(match.team1Id)}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Runs</Label>
                  <Input
                    type="number"
                    min={0}
                    value={superOverData.team1Runs}
                    onChange={(e) => setSuperOverData({ ...superOverData, team1Runs: parseInt(e.target.value) || 0 })}
                    data-testid="input-so-team1-runs"
                  />
                </div>
                <div>
                  <Label>Wickets</Label>
                  <Input
                    type="number"
                    min={0}
                    max={2}
                    value={superOverData.team1Wickets}
                    onChange={(e) => setSuperOverData({ ...superOverData, team1Wickets: parseInt(e.target.value) || 0 })}
                    data-testid="input-so-team1-wickets"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{getTeamName(match.team2Id)}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Runs</Label>
                  <Input
                    type="number"
                    min={0}
                    value={superOverData.team2Runs}
                    onChange={(e) => setSuperOverData({ ...superOverData, team2Runs: parseInt(e.target.value) || 0 })}
                    data-testid="input-so-team2-runs"
                  />
                </div>
                <div>
                  <Label>Wickets</Label>
                  <Input
                    type="number"
                    min={0}
                    max={2}
                    value={superOverData.team2Wickets}
                    onChange={(e) => setSuperOverData({ ...superOverData, team2Wickets: parseInt(e.target.value) || 0 })}
                    data-testid="input-so-team2-wickets"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSuperOverDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSuperOverSubmit} disabled={completeSuperOverMutation.isPending} data-testid="button-submit-super-over">
              <Check className="mr-2 h-4 w-4" />
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
