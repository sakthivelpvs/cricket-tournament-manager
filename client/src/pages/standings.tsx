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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Crown } from "lucide-react";
import type { Group } from "@shared/schema";

type StandingsData = {
  groupId: number;
  groupName: string;
  standings: Array<{
    teamId: number;
    teamName: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    points: number;
    qualified: boolean;
  }>;
};

export default function Standings() {
  const { data: standingsData, isLoading } = useQuery<StandingsData[]>({
    queryKey: ["/api/standings"],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Standings</h1>
        <p className="text-muted-foreground mt-2">
          View points table and team rankings
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : standingsData && standingsData.length > 0 ? (
        <div className="space-y-6">
          {standingsData.map((group) => (
            <Card key={group.groupId} data-testid={`card-standings-group-${group.groupId}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  {group.groupName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">T</TableHead>
                      <TableHead className="text-center font-bold">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.standings.map((team, index) => (
                      <TableRow
                        key={team.teamId}
                        className={team.qualified ? "bg-primary/5" : ""}
                        data-testid={`row-team-${team.teamId}`}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {team.teamName}
                            {team.qualified && (
                              <Crown className="h-4 w-4 text-primary" data-testid={`icon-qualified-${team.teamId}`} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center">{team.tied}</TableCell>
                        <TableCell className="text-center font-bold font-mono">
                          {team.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-4">
                  P = Played, W = Won, L = Lost, T = Tied, Pts = Points
                </p>
                {group.standings.some(t => t.qualified) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <Crown className="h-3 w-3 inline mr-1" />
                    Top 4 teams qualify for Semi Finals
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">No standings yet</h3>
              <p className="text-sm text-muted-foreground">
                Standings will appear once matches are completed
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
