import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Target, Zap } from "lucide-react";

type PlayerStats = {
  playerId: number;
  playerName: string;
  teamName: string;
  runs?: number;
  wickets?: number;
  strikeRate?: number;
  economy?: number;
};

type StatsData = {
  topBatsmen: PlayerStats[];
  topBowlers: PlayerStats[];
};

export default function Stats() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-2">
          Player performance and tournament statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Batsmen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.topBatsmen && stats.topBatsmen.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Runs</TableHead>
                    <TableHead className="text-right">SR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topBatsmen.map((player) => (
                    <TableRow key={player.playerId} data-testid={`row-batsman-${player.playerId}`}>
                      <TableCell className="font-medium">{player.playerName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {player.teamName}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {player.runs || 0}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {player.strikeRate?.toFixed(2) || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No batting statistics available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-destructive" />
              Top Bowlers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.topBowlers && stats.topBowlers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Wickets</TableHead>
                    <TableHead className="text-right">Econ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topBowlers.map((player) => (
                    <TableRow key={player.playerId} data-testid={`row-bowler-${player.playerId}`}>
                      <TableCell className="font-medium">{player.playerName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {player.teamName}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {player.wickets || 0}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {player.economy?.toFixed(2) || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No bowling statistics available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-chart-3" />
            Tournament Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold font-mono">{stats?.topBatsmen?.[0]?.runs || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Highest Score</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold font-mono">{stats?.topBowlers?.[0]?.wickets || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Most Wickets</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold font-mono">
                  {stats?.topBatsmen?.[0]?.strikeRate?.toFixed(0) || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Best SR</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold font-mono">
                  {stats?.topBowlers?.[0]?.economy?.toFixed(2) || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Best Economy</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
