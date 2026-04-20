import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";

type HealthResponse = {
  status: "ok" | string;
  timestamp?: string;
};

type DbStatusResponse = {
  success: boolean;
  status: "connected" | "disconnected" | "connecting" | "disconnecting" | string;
  database?: string;
  host?: string;
  port?: number;
  message?: string;
};

type ServiceItem = {
  name: string;
  status: "operational" | "degraded";
  uptime: string;
  detail?: string;
};

const APIStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStatus() {
      try {
        setLoading(true);
        setError(null);
        const [healthRes, dbRes] = await Promise.all([
          apiGet<HealthResponse>("/api/health"),
          apiGet<DbStatusResponse>("/api/db-status"),
        ]);

        if (!mounted) return;
        setHealth(healthRes);
        setDbStatus(dbRes);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to fetch API status");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const services = useMemo<ServiceItem[]>(() => {
    const coreApiOperational = health?.status === "ok";
    const dbOperational = dbStatus?.status === "connected";

    return [
      {
        name: "Core API",
        status: coreApiOperational ? "operational" : "degraded",
        uptime: coreApiOperational ? "Live" : "Down",
        detail: health?.timestamp
          ? `Last heartbeat: ${new Date(health.timestamp).toLocaleString()}`
          : undefined,
      },
      {
        name: "Database",
        status: dbOperational ? "operational" : "degraded",
        uptime: dbStatus?.status || "unknown",
        detail: dbOperational
          ? `${dbStatus?.database || "db"} @ ${dbStatus?.host || "host"}:${dbStatus?.port || "?"}`
          : dbStatus?.message || "Database is not connected",
      },
      {
        name: "Prediction Endpoint",
        status: coreApiOperational && dbOperational ? "operational" : "degraded",
        uptime: coreApiOperational && dbOperational ? "Live" : "Limited",
        detail: "POST /api/predict",
      },
      {
        name: "Alerts Service",
        status: coreApiOperational && dbOperational ? "operational" : "degraded",
        uptime: coreApiOperational && dbOperational ? "Live" : "Limited",
        detail: "GET /api/alerts",
      },
    ];
  }, [health, dbStatus]);

  const allOperational =
    services.length > 0 && services.every((service) => service.status === "operational");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container py-24 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            API <span className="text-primary">Status</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            {allOperational ? (
              <>
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="text-lg text-muted-foreground">All systems operational</p>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-warning" />
                <p className="text-lg text-muted-foreground">Some systems degraded</p>
              </>
            )}
          </div>
        </motion.div>

        {loading && (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="py-6 text-sm text-muted-foreground">
              Checking live backend status...
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && (
          <div className="max-w-3xl mx-auto space-y-3">
            {services.map((svc, i) => (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      {svc.status === "operational" ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                      <div>
                        <span className="font-medium">{svc.name}</span>
                        {svc.detail && (
                          <p className="text-xs text-muted-foreground mt-1">{svc.detail}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{svc.uptime}</span>
                      <Badge variant={svc.status === "operational" ? "default" : "secondary"}>
                        {svc.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default APIStatus;
