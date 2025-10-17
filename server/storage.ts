import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "./db";
import {
  tournaments,
  groups,
  teams,
  players,
  venues,
  matches,
  superOvers,
  visitors,
  rules,
  type Tournament,
  type InsertTournament,
  type Group,
  type InsertGroup,
  type Team,
  type InsertTeam,
  type Player,
  type InsertPlayer,
  type Venue,
  type InsertVenue,
  type Match,
  type InsertMatch,
  type SuperOver,
  type InsertSuperOver,
  type Visitor,
  type Rule,
  type InsertRule,
} from "@shared/schema";

export interface IStorage {
  // Tournaments
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: number, tournament: InsertTournament): Promise<Tournament | undefined>;
  deleteTournament(id: number): Promise<void>;

  // Groups
  getGroups(): Promise<Group[]>;
  getGroupsByTournament(tournamentId: number): Promise<Group[]>;
  getGroup(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, group: InsertGroup): Promise<Group | undefined>;
  deleteGroup(id: number): Promise<void>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: InsertTeam): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<void>;

  // Players
  getPlayers(teamId?: number): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: InsertPlayer): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<void>;

  // Venues
  getVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: InsertVenue): Promise<Venue | undefined>;
  deleteVenue(id: number): Promise<void>;

  // Matches
  getMatches(): Promise<Match[]>;
  getMatch(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<Match>): Promise<Match | undefined>;
  deleteMatch(id: number): Promise<void>;

  // Super Overs
  getSuperOver(matchId: number): Promise<SuperOver | undefined>;
  createSuperOver(superOver: InsertSuperOver): Promise<SuperOver>;
  updateSuperOver(id: number, superOver: Partial<SuperOver>): Promise<SuperOver | undefined>;

  // Visitors
  trackVisitor(ipAddress: string): Promise<void>;
  getVisitorStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    dailyStats: Array<{ date: string; count: number }>;
  }>;

  // Rules
  getRules(): Promise<Rule[]>;
  getRule(id: number): Promise<Rule | undefined>;
  createRule(rule: InsertRule): Promise<Rule>;
  updateRule(id: number, rule: InsertRule): Promise<Rule | undefined>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    tournaments: number;
    teams: number;
    matches: number;
    players: number;
    recentMatches: any[];
  }>;

  // Standings
  getStandings(): Promise<any[]>;

  // Stats
  getStats(): Promise<{
    topBatsmen: any[];
    topBowlers: any[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // Tournaments
  async getTournaments(): Promise<Tournament[]> {
    return db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament || undefined;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [created] = await db.insert(tournaments).values(tournament).returning();
    return created;
  }

  async updateTournament(id: number, tournament: InsertTournament): Promise<Tournament | undefined> {
    const [updated] = await db.update(tournaments).set(tournament).where(eq(tournaments.id, id)).returning();
    return updated || undefined;
  }

  async deleteTournament(id: number): Promise<void> {
    await db.delete(tournaments).where(eq(tournaments.id, id));
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return db.select().from(groups).orderBy(desc(groups.createdAt));
  }

  async getGroupsByTournament(tournamentId: number): Promise<Group[]> {
    return db.select().from(groups).where(eq(groups.tournamentId, tournamentId));
  }

  async getGroup(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group || undefined;
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [created] = await db.insert(groups).values(group).returning();
    return created;
  }

  async updateGroup(id: number, group: InsertGroup): Promise<Group | undefined> {
    const [updated] = await db.update(groups).set(group).where(eq(groups.id, id)).returning();
    return updated || undefined;
  }

  async deleteGroup(id: number): Promise<void> {
    await db.delete(groups).where(eq(groups.id, id));
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return db.select().from(teams).orderBy(desc(teams.createdAt));
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await db.insert(teams).values(team).returning();
    return created;
  }

  async updateTeam(id: number, team: InsertTeam): Promise<Team | undefined> {
    const [updated] = await db.update(teams).set(team).where(eq(teams.id, id)).returning();
    return updated || undefined;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Players
  async getPlayers(teamId?: number): Promise<Player[]> {
    if (teamId) {
      return db.select().from(players).where(eq(players.teamId, teamId)).orderBy(desc(players.createdAt));
    }
    return db.select().from(players).orderBy(desc(players.createdAt));
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [created] = await db.insert(players).values(player).returning();
    return created;
  }

  async updatePlayer(id: number, player: InsertPlayer): Promise<Player | undefined> {
    const [updated] = await db.update(players).set(player).where(eq(players.id, id)).returning();
    return updated || undefined;
  }

  async deletePlayer(id: number): Promise<void> {
    await db.delete(players).where(eq(players.id, id));
  }

  // Venues
  async getVenues(): Promise<Venue[]> {
    return db.select().from(venues).orderBy(desc(venues.createdAt));
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue || undefined;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [created] = await db.insert(venues).values(venue).returning();
    return created;
  }

  async updateVenue(id: number, venue: InsertVenue): Promise<Venue | undefined> {
    const [updated] = await db.update(venues).set(venue).where(eq(venues.id, id)).returning();
    return updated || undefined;
  }

  async deleteVenue(id: number): Promise<void> {
    await db.delete(venues).where(eq(venues.id, id));
  }

  // Matches
  async getMatches(): Promise<Match[]> {
    return db.select().from(matches).orderBy(desc(matches.matchDate));
  }

  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match || undefined;
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [created] = await db.insert(matches).values({
      ...match,
      currentBattingTeamId: match.battingFirstId || match.team1Id,
    }).returning();
    return created;
  }

  async updateMatch(id: number, match: Partial<Match>): Promise<Match | undefined> {
    const [updated] = await db.update(matches).set(match).where(eq(matches.id, id)).returning();
    return updated || undefined;
  }

  async deleteMatch(id: number): Promise<void> {
    await db.delete(matches).where(eq(matches.id, id));
  }

  // Super Overs
  async getSuperOver(matchId: number): Promise<SuperOver | undefined> {
    const [superOver] = await db.select().from(superOvers).where(eq(superOvers.matchId, matchId));
    return superOver || undefined;
  }

  async createSuperOver(superOver: InsertSuperOver): Promise<SuperOver> {
    const [created] = await db.insert(superOvers).values(superOver).returning();
    return created;
  }

  async updateSuperOver(id: number, superOver: Partial<SuperOver>): Promise<SuperOver | undefined> {
    const [updated] = await db.update(superOvers).set(superOver).where(eq(superOvers.id, id)).returning();
    return updated || undefined;
  }

  // Visitors
  async trackVisitor(ipAddress: string): Promise<void> {
    await db.insert(visitors).values({ ipAddress });
  }

  async getVisitorStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    dailyStats: Array<{ date: string; count: number }>;
  }> {
    const allVisitors = await db.select().from(visitors);
    const total = allVisitors.length;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const todayVisitors = allVisitors.filter(
      v => new Date(v.visitedAt) >= today
    ).length;

    const thisWeekVisitors = allVisitors.filter(
      v => new Date(v.visitedAt) >= weekAgo
    ).length;

    const dailyStatsMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStatsMap.set(dateStr, 0);
    }

    allVisitors.forEach(v => {
      const dateStr = new Date(v.visitedAt).toISOString().split('T')[0];
      if (dailyStatsMap.has(dateStr)) {
        dailyStatsMap.set(dateStr, (dailyStatsMap.get(dateStr) || 0) + 1);
      }
    });

    const dailyStats = Array.from(dailyStatsMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return { total, today: todayVisitors, thisWeek: thisWeekVisitors, dailyStats };
  }

  // Rules
  async getRules(): Promise<Rule[]> {
    return db.select().from(rules);
  }

  async getRule(id: number): Promise<Rule | undefined> {
    const [rule] = await db.select().from(rules).where(eq(rules.id, id));
    return rule || undefined;
  }

  async createRule(rule: InsertRule): Promise<Rule> {
    const [created] = await db.insert(rules).values(rule).returning();
    return created;
  }

  async updateRule(id: number, rule: InsertRule): Promise<Rule | undefined> {
    const [updated] = await db.update(rules).set({ ...rule, updatedAt: new Date() }).where(eq(rules.id, id)).returning();
    return updated || undefined;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    tournaments: number;
    teams: number;
    matches: number;
    players: number;
    recentMatches: any[];
  }> {
    const [tournamentsData] = await db.select({ count: sql<number>`count(*)::int` }).from(tournaments);
    const [teamsData] = await db.select({ count: sql<number>`count(*)::int` }).from(teams);
    const [matchesData] = await db.select({ count: sql<number>`count(*)::int` }).from(matches);
    const [playersData] = await db.select({ count: sql<number>`count(*)::int` }).from(players);

    const recentMatchesData = await db.select().from(matches).orderBy(desc(matches.matchDate)).limit(5);
    
    const recentMatches = await Promise.all(
      recentMatchesData.map(async (match) => {
        const team1 = await this.getTeam(match.team1Id);
        const team2 = await this.getTeam(match.team2Id);
        return {
          id: match.id,
          team1: team1?.name || "Unknown",
          team2: team2?.name || "Unknown",
          stage: match.stage,
          score: match.status === "completed" 
            ? `${match.team1Score}/${match.team1Wickets} vs ${match.team2Score}/${match.team2Wickets}`
            : null,
        };
      })
    );

    return {
      tournaments: tournamentsData.count || 0,
      teams: teamsData.count || 0,
      matches: matchesData.count || 0,
      players: playersData.count || 0,
      recentMatches,
    };
  }

  // Standings
  async getStandings(): Promise<any[]> {
    const allGroups = await this.getGroups();
    const allMatches = await this.getMatches();
    const allTeams = await this.getTeams();

    const standings = await Promise.all(
      allGroups.map(async (group) => {
        const groupTeams = allTeams.filter(t => t.groupId === group.id);
        
        const teamStandings = groupTeams.map(team => {
          const teamMatches = allMatches.filter(
            m => (m.team1Id === team.id || m.team2Id === team.id) && m.status === "completed"
          );

          let won = 0, lost = 0, tied = 0;
          
          teamMatches.forEach(match => {
            if (match.result === "tie") {
              tied++;
            } else if (match.winnerId === team.id) {
              won++;
            } else {
              lost++;
            }
          });

          const points = won * 2 + tied * 1;
          const played = teamMatches.length;

          return {
            teamId: team.id,
            teamName: team.name,
            played,
            won,
            lost,
            tied,
            points,
            qualified: false,
          };
        });

        teamStandings.sort((a, b) => b.points - a.points);
        
        teamStandings.forEach((team, index) => {
          team.qualified = index < 4;
        });

        return {
          groupId: group.id,
          groupName: group.name,
          standings: teamStandings,
        };
      })
    );

    return standings;
  }

  // Stats
  async getStats(): Promise<{
    topBatsmen: any[];
    topBowlers: any[];
  }> {
    return {
      topBatsmen: [],
      topBowlers: [],
    };
  }
}

export const storage = new DatabaseStorage();
