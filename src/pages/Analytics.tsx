import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, AlertTriangle, Coffee, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { apiGet } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type TrendsResponse = {
  success: boolean;
  data: {
    gaitByAgeBand: Array<{ ageBand: string; avgGaitScore: number; sampleCount: number }>;
    sensorAverages: Record<string, number>;
    riskByFoot: Array<{
      foot: "left" | "right";
      avgImbalance: number;
      avgGaitScore: number;
      highRiskCount: number;
      total: number;
    }>;
  };
};

type SummaryResponse = {
  success: boolean;
  data: {
    totalSamples: number;
    highRiskCount: number;
    avgGaitScore: number;
    avgForceImbalance: number;
    flatFootDistribution: Array<{ flat_foot: "yes" | "no"; count: number }>;
  };
};

const iconMap: Record<string, any> = {
  "trending-up": TrendingUp,
  coffee: Coffee,
  dumbbell: Dumbbell,
  "alert-triangle": AlertTriangle,
};

function toPressureZones(sensorAverages: Record<string, number>, flip = false) {
  const values = [
    sensorAverages.Force_1_mean || 0,
    sensorAverages.Force_2_mean || 0,
    sensorAverages.Force_3_mean || 0,
    sensorAverages.Force_4_mean || 0,
  ];
  const max = Math.max(...values, 1);
  const zones = [
    { zone: "heel", pressure: Math.round((values[0] / max) * 100), x: flip ? 54 : 46, y: 85 },
    { zone: "arch", pressure: Math.round((values[1] / max) * 100), x: flip ? 58 : 42, y: 55 },
    { zone: "ball", pressure: Math.round((values[2] / max) * 100), x: flip ? 62 : 38, y: 25 },
    { zone: "toes", pressure: Math.round((values[3] / max) * 100), x: 50, y: 8 },
  ];
  return zones;
}

function PressureHeatmap({
  data,
  label,
}: {
  data: Array<{ zone: string; pressure: number; x: number; y: number }>;
  label: string;
}) {
  const getColor = (pressure: number) => {
    if (pressure > 75) return "hsl(var(--destructive))";
    if (pressure > 50) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-center">{label}</p>
      <svg viewBox="0 0 100 100" className="w-full max-w-[160px] mx-auto" aria-label={`${label} pressure map`}>
        <ellipse cx="50" cy="50" rx="28" ry="45" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
        {data.map((zone) => (
          <g key={zone.zone}>
            <circle cx={zone.x} cy={zone.y} r={zone.pressure / 6} fill={getColor(zone.pressure)} opacity={0.7} />
            <text
              x={zone.x}
              y={zone.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5"
              fill="hsl(var(--foreground))"
              fontWeight="bold"
            >
              {zone.pressure}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResponse["data"] | null>(null);
  const [leftTrends, setLeftTrends] = useState<TrendsResponse["data"] | null>(null);
  const [rightTrends, setRightTrends] = useState<TrendsResponse["data"] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [summaryRes, leftRes, rightRes] = await Promise.all([
          apiGet<SummaryResponse>("/api/dashboard/summary"),
          apiGet<TrendsResponse>("/api/dashboard/trends?foot=left"),
          apiGet<TrendsResponse>("/api/dashboard/trends?foot=right"),
        ]);

        if (!mounted) return;
        setSummary(summaryRes.data);
        setLeftTrends(leftRes.data);
        setRightTrends(rightRes.data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const pressureData = useMemo(
    () => ({
      leftFoot: toPressureZones(leftTrends?.sensorAverages || {}, false),
      rightFoot: toPressureZones(rightTrends?.sensorAverages || {}, true),
    }),
    [leftTrends, rightTrends]
  );

  const symmetryData = useMemo(() => {
    const left = leftTrends?.riskByFoot?.[0];
    const right = rightTrends?.riskByFoot?.[0];
    if (!left || !right) return [];

    const leftRiskPct = left.total ? (left.highRiskCount / left.total) * 100 : 0;
    const rightRiskPct = right.total ? (right.highRiskCount / right.total) * 100 : 0;
    const maxImbalance = Math.max(left.avgImbalance, right.avgImbalance, 1);

    return [
      {
        metric: "Avg Gait",
        left: Number((left.avgGaitScore * 25).toFixed(2)),
        right: Number((right.avgGaitScore * 25).toFixed(2)),
      },
      {
        metric: "High Risk %",
        left: Number(leftRiskPct.toFixed(2)),
        right: Number(rightRiskPct.toFixed(2)),
      },
      {
        metric: "Imbalance Index",
        left: Number(((left.avgImbalance / maxImbalance) * 100).toFixed(2)),
        right: Number(((right.avgImbalance / maxImbalance) * 100).toFixed(2)),
      },
    ];
  }, [leftTrends, rightTrends]);

  const trendData = useMemo(() => {
    const leftMap = new Map((leftTrends?.gaitByAgeBand || []).map((row) => [row.ageBand, row]));
    const rightMap = new Map((rightTrends?.gaitByAgeBand || []).map((row) => [row.ageBand, row]));
    const labels = ["30-35", "36-40", "41-45", "46-50", "51-55", "56-60"];

    return labels.map((label) => ({
      ageBand: label,
      leftGait: leftMap.get(label)?.avgGaitScore ?? 0,
      rightGait: rightMap.get(label)?.avgGaitScore ?? 0,
    }));
  }, [leftTrends, rightTrends]);

  const aiInsights = useMemo(() => {
    if (!summary || !leftTrends || !rightTrends) return [];
    const flatYes =
      summary.flatFootDistribution.find((item) => item.flat_foot === "yes")?.count || 0;
    const left = leftTrends.riskByFoot?.[0];
    const right = rightTrends.riskByFoot?.[0];
    const dominantRiskFoot =
      (left?.highRiskCount || 0) >= (right?.highRiskCount || 0) ? "left" : "right";

    return [
      {
        title: "Overall Gait Signal",
        description: `Average gait score is ${summary.avgGaitScore.toFixed(
          2
        )}. Continue weekly monitoring for trend shifts.`,
        icon: "trending-up",
      },
      {
        title: "Imbalance Observation",
        description: `${dominantRiskFoot.toUpperCase()} foot shows higher risk concentration. Add side-specific balance work.`,
        icon: "dumbbell",
      },
      {
        title: "Flat Foot Monitoring",
        description: `${flatYes} records are flat-foot positive. Arch support and mobility routines are recommended.`,
        icon: "coffee",
      },
      {
        title: "Risk Action",
        description: `${summary.highRiskCount} samples are medium/high risk. Prioritize targeted follow-up sessions.`,
        icon: "alert-triangle",
      },
    ];
  }, [summary, leftTrends, rightTrends]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Monitoring</h1>
          <p className="text-muted-foreground">Deep insights from your real dataset.</p>
        </div>

        {loading && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading analytics...</CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Foot Pressure Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                    <PressureHeatmap data={pressureData.leftFoot} label="Left Foot" />
                    <PressureHeatmap data={pressureData.rightFoot} label="Right Foot" />
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-success" /> Low (0-50%)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-warning" /> Medium (50-75%)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-destructive" /> High (75%+)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Left vs Right Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={symmetryData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="left" name="Left Foot %" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="right" name="Right Foot %" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Gait Trend by Age Band</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="ageBand" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="leftGait"
                          name="Left Gait Score"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-1))" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rightGait"
                          name="Right Gait Score"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-2))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">AI-Generated Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiInsights.map((insight, i) => {
                  const Icon = iconMap[insight.icon] || TrendingUp;
                  return (
                    <motion.div
                      key={insight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5 flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{insight.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
