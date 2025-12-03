import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  height: decimal("height", { precision: 5, scale: 2 }).notNull(),
  activityLevel: text("activity_level").notNull(),
  goal: text("goal").notNull(),
  dietaryPreferences: jsonb("dietary_preferences").$type<string[]>().default([]),
  restrictions: jsonb("restrictions").$type<string[]>().default([]),
  allergies: jsonb("allergies").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const nutritionPlans = pgTable("nutrition_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").notNull().references(() => profiles.id),
  isActive: boolean("is_active").default(false).notNull(),
  dailyCalories: integer("daily_calories").notNull(),
  macros: jsonb("macros").$type<{ protein: number; carbs: number; fats: number }>().notNull(),
  meals: jsonb("meals").$type<any[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNutritionPlanSchema = createInsertSchema(nutritionPlans).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertNutritionPlan = z.infer<typeof insertNutritionPlanSchema>;
export type NutritionPlan = typeof nutritionPlans.$inferSelect;
