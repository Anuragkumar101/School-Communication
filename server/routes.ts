import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User synchronization route
  app.post("/api/users/sync", async (req, res) => {
    try {
      const userData = {
        uid: req.body.uid,
        email: req.body.email,
        displayName: req.body.displayName,
        photoURL: req.body.photoURL
      };

      // Check if user exists by uid
      const existingUser = await storage.getUserByUid(userData.uid);
      
      if (existingUser) {
        // Update existing user
        const updatedUser = await storage.updateUser(existingUser.id, userData);
        res.json(updatedUser);
      } else {
        // Create new user
        const newUser = await storage.createUser({
          username: userData.email, // Use email as username
          password: "", // Password stored in Firebase
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          uid: userData.uid
        });
        res.json(newUser);
      }
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ message: "Failed to sync user data" });
    }
  });

  // Handle user registration directly on server (optional fallback)
  app.post("/api/users", async (req, res) => {
    try {
      const userSchema = insertUserSchema.extend({
        confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
      
      const userData = userSchema.parse(req.body);
      
      // Remove confirmPassword before inserting
      const { confirmPassword, ...userToInsert } = userData;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userToInsert.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userToInsert);
      
      // Don't return the password in the response
      const { password, ...userResponse } = newUser;
      
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
