import { type User, type InsertUser, type Profile, type InsertProfile, type NutritionPlan, type InsertNutritionPlan } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profiles
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { userId: string }): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Nutrition Plans
  createNutritionPlan(plan: InsertNutritionPlan & { userId: string }): Promise<NutritionPlan>;
  getNutritionPlan(id: string): Promise<NutritionPlan | undefined>;
  getActivePlan(userId: string): Promise<NutritionPlan | undefined>;
  getPlanHistory(userId: string): Promise<NutritionPlan[]>;
  activatePlan(planId: string, userId: string): Promise<NutritionPlan | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private nutritionPlans: Map<string, NutritionPlan>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.nutritionPlans = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createProfile(profile: InsertProfile & { userId: string }): Promise<Profile> {
    const id = randomUUID();
    const newProfile: Profile = {
      ...profile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateProfile(userId: string, profileData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existingProfile = await this.getProfileByUserId(userId);
    if (!existingProfile) return undefined;

    const updatedProfile: Profile = {
      ...existingProfile,
      ...profileData,
      updatedAt: new Date(),
    };
    this.profiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  async createNutritionPlan(plan: InsertNutritionPlan & { userId: string }): Promise<NutritionPlan> {
    const id = randomUUID();
    
    // Deactivate all other plans for this user
    for (const [planId, existingPlan] of this.nutritionPlans.entries()) {
      if (existingPlan.userId === plan.userId && existingPlan.isActive) {
        this.nutritionPlans.set(planId, { ...existingPlan, isActive: false });
      }
    }

    const newPlan: NutritionPlan = {
      ...plan,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.nutritionPlans.set(id, newPlan);
    return newPlan;
  }

  async getNutritionPlan(id: string): Promise<NutritionPlan | undefined> {
    return this.nutritionPlans.get(id);
  }

  async getActivePlan(userId: string): Promise<NutritionPlan | undefined> {
    return Array.from(this.nutritionPlans.values()).find(
      (plan) => plan.userId === userId && plan.isActive,
    );
  }

  async getPlanHistory(userId: string): Promise<NutritionPlan[]> {
    return Array.from(this.nutritionPlans.values())
      .filter((plan) => plan.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async activatePlan(planId: string, userId: string): Promise<NutritionPlan | undefined> {
    const plan = this.nutritionPlans.get(planId);
    if (!plan || plan.userId !== userId) return undefined;

    // Deactivate all other plans
    for (const [id, existingPlan] of this.nutritionPlans.entries()) {
      if (existingPlan.userId === userId && existingPlan.isActive) {
        this.nutritionPlans.set(id, { ...existingPlan, isActive: false });
      }
    }

    // Activate the selected plan
    const activatedPlan = { ...plan, isActive: true };
    this.nutritionPlans.set(planId, activatedPlan);
    return activatedPlan;
  }
}

export const storage = new MemStorage();
