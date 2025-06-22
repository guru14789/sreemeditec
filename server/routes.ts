import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import quoteRoutes from "./routes/quotes";
import adminRoutes from "./routes/admin";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/quotes", quoteRoutes);
  app.use("/api/admin", adminRoutes);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Legacy storage routes (keeping for compatibility)
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get user", error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
