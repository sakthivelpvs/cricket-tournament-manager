import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial, jsonb, decimal, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tournaments
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  oversPerMatch: integer("overs_per_match").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  groups: many(groups),
  matches: many(matches),
}));

// Groups within tournaments
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [groups.tournamentId],
    references: [tournaments.id],
  }),
  teams: many(teams),
}));

// Teams
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  captain: text("captain").notNull(),
  contactNumber: text("contact_number").notNull(),
  groupId: integer("group_id").references(() => groups.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
  group: one(groups, {
    fields: [teams.groupId],
    references: [groups.id],
  }),
  players: many(players),
  matchesAsTeam1: many(matches, { relationName: "team1" }),
  matchesAsTeam2: many(matches, { relationName: "team2" }),
}));

// Players
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  role: text("role").notNull(), // batsman, bowler, all-rounder
  teamId: integer("team_id").notNull().references(() => teams.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

// Venues
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const venuesRelations = relations(venues, ({ many }) => ({
  matches: many(matches),
}));

// Matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  stage: text("stage").notNull(), // League, Semi Final, Final
  team1Id: integer("team1_id").notNull().references(() => teams.id),
  team2Id: integer("team2_id").notNull().references(() => teams.id),
  venueId: integer("venue_id").references(() => venues.id, { onDelete: 'set null' }),
  tossWinnerId: integer("toss_winner_id").references(() => teams.id),
  battingFirstId: integer("batting_first_id").references(() => teams.id),
  overs: integer("overs").notNull(),
  matchDate: timestamp("match_date").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, abandoned
  result: text("result"), // team1_win, team2_win, tie, abandoned
  winnerId: integer("winner_id").references(() => teams.id),
  team1Score: integer("team1_score").default(0),
  team1Wickets: integer("team1_wickets").default(0),
  team1Overs: decimal("team1_overs", { precision: 3, scale: 1 }).default("0.0"),
  team2Score: integer("team2_score").default(0),
  team2Wickets: integer("team2_wickets").default(0),
  team2Overs: decimal("team2_overs", { precision: 3, scale: 1 }).default("0.0"),
  currentInnings: integer("current_innings").default(1), // 1 or 2
  currentBattingTeamId: integer("current_batting_team_id").references(() => teams.id),
  ballByBallData: jsonb("ball_by_ball_data").default([]), // Array of ball data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matchesRelations = relations(matches, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
    relationName: "team1",
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
    relationName: "team2",
  }),
  venue: one(venues, {
    fields: [matches.venueId],
    references: [venues.id],
  }),
  tossWinner: one(teams, {
    fields: [matches.tossWinnerId],
    references: [teams.id],
  }),
  battingFirst: one(teams, {
    fields: [matches.battingFirstId],
    references: [teams.id],
  }),
  winner: one(teams, {
    fields: [matches.winnerId],
    references: [teams.id],
  }),
  currentBattingTeam: one(teams, {
    fields: [matches.currentBattingTeamId],
    references: [teams.id],
  }),
  superOver: one(superOvers),
}));

// Super Overs
export const superOvers = pgTable("super_overs", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => matches.id, { onDelete: 'cascade' }).unique(),
  team1Runs: integer("team1_runs").default(0),
  team1Wickets: integer("team1_wickets").default(0),
  team2Runs: integer("team2_runs").default(0),
  team2Wickets: integer("team2_wickets").default(0),
  winnerId: integer("winner_id").references(() => teams.id),
  ballByBallData: jsonb("ball_by_ball_data").default([]), // Ball-by-ball data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const superOversRelations = relations(superOvers, ({ one }) => ({
  match: one(matches, {
    fields: [superOvers.matchId],
    references: [matches.id],
  }),
  winner: one(teams, {
    fields: [superOvers.winnerId],
    references: [teams.id],
  }),
}));

// Visitors tracking
export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

// Rules (editable content)
export const rules = pgTable("rules", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertTournamentSchema = createInsertSchema(tournaments, {
  name: z.string().min(1, "Tournament name is required"),
  startDate: z.string(),
  endDate: z.string(),
  oversPerMatch: z.number().min(5).max(10),
}).omit({ id: true, createdAt: true });

export const insertGroupSchema = createInsertSchema(groups, {
  name: z.string().min(1, "Group name is required"),
  tournamentId: z.number(),
}).omit({ id: true, createdAt: true });

export const insertTeamSchema = createInsertSchema(teams, {
  name: z.string().min(1, "Team name is required"),
  captain: z.string().min(1, "Captain name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
}).omit({ id: true, createdAt: true });

export const insertPlayerSchema = createInsertSchema(players, {
  name: z.string().min(1, "Player name is required"),
  age: z.number().min(10).max(100),
  role: z.enum(["batsman", "bowler", "all-rounder"]),
  teamId: z.number(),
}).omit({ id: true, createdAt: true });

export const insertVenueSchema = createInsertSchema(venues, {
  name: z.string().min(1, "Venue name is required"),
  location: z.string().min(1, "Location is required"),
}).omit({ id: true, createdAt: true });

export const insertMatchSchema = createInsertSchema(matches, {
  tournamentId: z.number(),
  stage: z.enum(["League", "Semi Final", "Final"]),
  team1Id: z.number(),
  team2Id: z.number(),
  overs: z.number().min(5).max(10),
  matchDate: z.string(),
}).omit({ 
  id: true, 
  createdAt: true, 
  status: true, 
  result: true, 
  team1Score: true, 
  team1Wickets: true, 
  team1Overs: true,
  team2Score: true,
  team2Wickets: true,
  team2Overs: true,
  currentInnings: true,
  ballByBallData: true,
});

export const insertSuperOverSchema = createInsertSchema(superOvers, {
  matchId: z.number(),
}).omit({ id: true, createdAt: true });

export const insertRuleSchema = createInsertSchema(rules, {
  content: z.string().min(1, "Content is required"),
}).omit({ id: true, updatedAt: true });

// Types
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type SuperOver = typeof superOvers.$inferSelect;
export type InsertSuperOver = z.infer<typeof insertSuperOverSchema>;

export type Visitor = typeof visitors.$inferSelect;

export type Rule = typeof rules.$inferSelect;
export type InsertRule = z.infer<typeof insertRuleSchema>;
