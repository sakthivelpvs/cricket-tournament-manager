import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTournamentSchema,
  insertGroupSchema,
  insertTeamSchema,
  insertPlayerSchema,
  insertVenueSchema,
  insertMatchSchema,
  insertSuperOverSchema,
  insertRuleSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Visitor tracking middleware
  app.use((req, res, next) => {
    const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
    storage.trackVisitor(ipAddress).catch(console.error);
    next();
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Tournaments
  app.get("/api/tournaments", async (req: Request, res: Response) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tournaments/:id", async (req: Request, res: Response) => {
    try {
      const tournament = await storage.getTournament(parseInt(req.params.id));
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tournaments", async (req: Request, res: Response) => {
    try {
      const validated = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validated);
      res.status(201).json(tournament);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/tournaments/:id", async (req: Request, res: Response) => {
    try {
      const validated = insertTournamentSchema.parse(req.body);
      const tournament = await storage.updateTournament(parseInt(req.params.id), validated);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/tournaments/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteTournament(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Groups
  app.get("/api/groups", async (req: Request, res: Response) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/groups/:id", async (req: Request, res: Response) => {
    try {
      const group = await storage.getGroup(parseInt(req.params.id));
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      res.json(group);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/groups", async (req: Request, res: Response) => {
    try {
      const validated = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(validated);
      res.status(201).json(group);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/groups/:id", async (req: Request, res: Response) => {
    try {
      const validated = insertGroupSchema.parse(req.body);
      const group = await storage.updateGroup(parseInt(req.params.id), validated);
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
      res.json(group);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/groups/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteGroup(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Teams
  app.get("/api/teams", async (req: Request, res: Response) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/teams/:id", async (req: Request, res: Response) => {
    try {
      const team = await storage.getTeam(parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/teams", async (req: Request, res: Response) => {
    try {
      const validated = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validated);
      res.status(201).json(team);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/teams/:id", async (req: Request, res: Response) => {
    try {
      const validated = insertTeamSchema.parse(req.body);
      const team = await storage.updateTeam(parseInt(req.params.id), validated);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/teams/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteTeam(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Players
  app.get("/api/players", async (req: Request, res: Response) => {
    try {
      const teamId = req.query.teamId ? parseInt(req.query.teamId as string) : undefined;
      const players = await storage.getPlayers(teamId);
      res.json(players);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/players/:id", async (req: Request, res: Response) => {
    try {
      const player = await storage.getPlayer(parseInt(req.params.id));
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/players", async (req: Request, res: Response) => {
    try {
      const validated = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validated);
      res.status(201).json(player);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/players/:id", async (req: Request, res: Response) => {
    try {
      const validated = insertPlayerSchema.parse(req.body);
      const player = await storage.updatePlayer(parseInt(req.params.id), validated);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/players/:id", async (req: Request, res: Response) => {
    try {
      await storage.deletePlayer(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Venues
  app.get("/api/venues", async (req: Request, res: Response) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/venues/:id", async (req: Request, res: Response) => {
    try {
      const venue = await storage.getVenue(parseInt(req.params.id));
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }
      res.json(venue);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/venues", async (req: Request, res: Response) => {
    try {
      const validated = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(validated);
      res.status(201).json(venue);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/venues/:id", async (req: Request, res: Response) => {
    try {
      const validated = insertVenueSchema.parse(req.body);
      const venue = await storage.updateVenue(parseInt(req.params.id), validated);
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }
      res.json(venue);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/venues/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteVenue(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Matches
  app.get("/api/matches", async (req: Request, res: Response) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/matches/:id", async (req: Request, res: Response) => {
    try {
      const match = await storage.getMatch(parseInt(req.params.id));
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/matches", async (req: Request, res: Response) => {
    try {
      const validated = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validated);
      res.status(201).json(match);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/matches/:id", async (req: Request, res: Response) => {
    try {
      const match = await storage.updateMatch(parseInt(req.params.id), req.body);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      res.json(match);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/matches/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteMatch(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Match scoring
  app.post("/api/matches/:id/score", async (req: Request, res: Response) => {
    try {
      const matchId = parseInt(req.params.id);
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      const { runs, extras, isWicket } = req.body;
      
      // Update match status to in_progress if scheduled
      if (match.status === "scheduled") {
        await storage.updateMatch(matchId, { status: "in_progress" });
      }

      const isTeam1Batting = match.currentBattingTeamId === match.team1Id;
      let currentScore = isTeam1Batting ? match.team1Score || 0 : match.team2Score || 0;
      let currentWickets = isTeam1Batting ? match.team1Wickets || 0 : match.team2Wickets || 0;
      let currentOvers = parseFloat((isTeam1Batting ? match.team1Overs : match.team2Overs) || "0.0");

      // Update score
      currentScore += runs || 0;
      if (isWicket) {
        currentWickets++;
      }

      // Update overs (only if not an extra like wide or no-ball)
      if (!extras || (extras !== "wide" && extras !== "no-ball")) {
        const balls = Math.floor((currentOvers % 1) * 10) + 1;
        if (balls >= 6) {
          currentOvers = Math.floor(currentOvers) + 1;
        } else {
          currentOvers = Math.floor(currentOvers) + (balls / 10);
        }
      }

      // Check if innings complete
      const inningsComplete = currentWickets >= 10 || Math.floor(currentOvers) >= match.overs;

      let updates: any = {};
      if (isTeam1Batting) {
        updates.team1Score = currentScore;
        updates.team1Wickets = currentWickets;
        updates.team1Overs = currentOvers.toFixed(1);
      } else {
        updates.team2Score = currentScore;
        updates.team2Wickets = currentWickets;
        updates.team2Overs = currentOvers.toFixed(1);
      }

      // If innings complete, switch batting team or complete match
      if (inningsComplete) {
        if (match.currentInnings === 1) {
          updates.currentInnings = 2;
          updates.currentBattingTeamId = match.currentBattingTeamId === match.team1Id ? match.team2Id : match.team1Id;
        } else {
          // Match completed - determine result
          const team1Score = isTeam1Batting ? currentScore : match.team1Score || 0;
          const team2Score = isTeam1Batting ? match.team2Score || 0 : currentScore;

          if (team1Score > team2Score) {
            updates.result = "team1_win";
            updates.winnerId = match.team1Id;
          } else if (team2Score > team1Score) {
            updates.result = "team2_win";
            updates.winnerId = match.team2Id;
          } else {
            updates.result = "tie";
          }
          updates.status = "completed";
        }
      }

      const updatedMatch = await storage.updateMatch(matchId, updates);
      res.json(updatedMatch);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Undo last ball
  app.post("/api/matches/:id/undo", async (req: Request, res: Response) => {
    try {
      const match = await storage.getMatch(parseInt(req.params.id));
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }
      // Simple implementation - in production would track ball-by-ball history
      res.json(match);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Super Over
  app.post("/api/matches/:id/super-over", async (req: Request, res: Response) => {
    try {
      const matchId = parseInt(req.params.id);
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      const { team1Runs, team1Wickets, team2Runs, team2Wickets } = req.body;
      
      let winnerId = null;
      if (team1Runs > team2Runs) {
        winnerId = match.team1Id;
      } else if (team2Runs > team1Runs) {
        winnerId = match.team2Id;
      }

      const superOver = await storage.createSuperOver({
        matchId,
        team1Runs,
        team1Wickets,
        team2Runs,
        team2Wickets,
        winnerId,
      });

      await storage.updateMatch(matchId, {
        winnerId,
        result: winnerId ? (winnerId === match.team1Id ? "team1_win" : "team2_win") : "tie",
      });

      res.json(superOver);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Standings
  app.get("/api/standings", async (req: Request, res: Response) => {
    try {
      const standings = await storage.getStandings();
      res.json(standings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Visitors
  app.get("/api/visitors/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getVisitorStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Rules
  app.get("/api/rules", async (req: Request, res: Response) => {
    try {
      const rules = await storage.getRules();
      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/rules/:id", async (req: Request, res: Response) => {
    try {
      const rule = await storage.getRule(parseInt(req.params.id));
      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }
      res.json(rule);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/rules", async (req: Request, res: Response) => {
    try {
      const validated = insertRuleSchema.parse(req.body);
      const rule = await storage.createRule(validated);
      res.status(201).json(rule);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/rules/:id", async (req: Request, res: Response) => {
    try {
      const validated = insertRuleSchema.parse(req.body);
      const rule = await storage.updateRule(parseInt(req.params.id), validated);
      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }
      res.json(rule);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
