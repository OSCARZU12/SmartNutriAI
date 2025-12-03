import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Este servidor solo sirve el frontend
  // Todas las rutas /api/* son redirigidas al backend Flask mediante el proxy de Vite
  // (configurado en vite.config.ts)

  // Health check local (opcional)
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "frontend-server",
      timestamp: new Date().toISOString()
    });
  });



  const httpServer = createServer(app);
  return httpServer;
}
