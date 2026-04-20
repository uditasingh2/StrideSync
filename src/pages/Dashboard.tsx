import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Footprints,
  Activity,
  Heart,
  Flame,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/DashboardLayout";
import { apiGet } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type SummaryResponse = {
  success: boolean;
  data: {
    totalSamples: number;
    highRiskCount: number;
    avgGaitScore: number;
    avgForceImbalance: number;
    avgAge: number;
    footDistribution: Array<{ foot: "left" | "right"; count: number }>;
    gaitScoreDistribution: Array<{ score: number; count: number }>;
    flatFootDistribution: Array<{ flat_foot: "yes" | "no"; count: number }>;
  };
};

type TrendsResponse = {
  success: boolean;
  data: {
    gaitByAgeBand: Array<{ ageBand: string; avgGaitScore: number; sampleCount: number }>;
  };
};

type SamplesResponse = {
  success: boolean;
  items: Array<{
    _id: string;
    file: string;
    source_row_number: number;
    foot: "left" | "right";
    Force_1_nonzero_count: number;
    Force_2_nonzero_count: number;
    Force_3_nonzero_count: number;
    Force_4_nonzero_count: number;
    gait_score: number;
  }>;
};

type AlertsResponse = {
  success: boolean;
  count: number;
  data: Array<{
    id: string;
    severity: "high" | "medium" | "low";
    title: string;
    message: string;
    file: string;
    source_row_number: number;
  }>;
};

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResponse["data"] | null>(null);
  const [trends, setTrends] = useState<TrendsResponse["data"] | null>(null);
  const [samples, setSamples] = useState<SamplesResponse["items"]>([]);
  const [alerts, setAlerts] = useState<AlertsResponse["data"]>([]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [summaryRes, trendsRes, samplesRes, alertsRes] = await Promise.all([
          apiGet<SummaryResponse>("/api/dashboard/summary"),
          apiGet<TrendsResponse>("/api/dashboard/trends"),
          apiGet<SamplesResponse>("/api/samples?limit=5"),
          apiGet<AlertsResponse>("/api/alerts?limit=8"),
        ]);

        if (!mounted) return;
        setSummary(summaryRes.data);
        setTrends(trendsRes.data);
        setSamples(samplesRes.items || []);
        setAlerts(alertsRes.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    if (!summary) return [];
    const flatFootCases =
      summary.flatFootDistribution.find((item) => item.flat_foot === "yes")?.count || 0;
    const riskPercent = summary.totalSamples
      ? (summary.highRiskCount / summary.totalSamples) * 100
      : 0;

    return [
      {
        icon: Footprints,
        label: "Total Samples",
        value: summary.totalSamples.toLocaleString(),
        sub: "Imported dataset rows",
      },
      {
        icon: Activity,
        label: "Avg Gait Score",
        value: summary.avgGaitScore.toFixed(2),
        sub: "Across all records",
        color: "text-success",
      },
      {
        icon: Heart,
        label: "High Risk Samples",
        value: summary.highRiskCount.toLocaleString(),
        sub: `${riskPercent.toFixed(1)}% of total`,
        color: riskPercent > 45 ? "text-warning" : "text-success",
        progress: riskPercent,
      },
      {
        icon: Flame,
        label: "Flat Foot Cases",
        value: flatFootCases.toLocaleString(),
        sub: "Records flagged as yes",
      },
    ];
  }, [summary]);

  const scoreChartData = useMemo(() => {
    if (!summary) return [];
    const targetPerBucket = Math.round(summary.totalSamples / 4);
    return summary.gaitScoreDistribution.map((item) => ({
      label: `Score ${item.score}`,
      count: item.count,
      target: targetPerBucket,
    }));
  }, [summary]);

  const ageBandTrend = trends?.gaitByAgeBand || [];

  const activityTimeline = useMemo(
    () =>
      samples.map((sample) => ({
        id: sample._id,
        activity: `${sample.foot.toUpperCase()} sample`,
        time: `Row ${sample.source_row_number}`,
        steps:
          sample.Force_1_nonzero_count +
          sample.Force_2_nonzero_count +
          sample.Force_3_nonzero_count +
          sample.Force_4_nonzero_count,
        duration: sample.file,
      })),
    [samples]
  );

  const recommendations = useMemo(() => {
    if (!summary) return [];
    const flatYes =
      summary.flatFootDistribution.find((item) => item.flat_foot === "yes")?.count || 0;
    const highRiskPercent = summary.totalSamples
      ? (summary.highRiskCount / summary.totalSamples) * 100
      : 0;

    const recs = [
      {
        title: "Balance Training",
        desc: `Average force imbalance is ${summary.avgForceImbalance.toFixed(
          1
        )}. Add left-right balancing drills daily.`,
        type: "Exercise",
      },
      {
        title: "Risk Monitoring",
        desc: `${highRiskPercent.toFixed(
          1
        )}% samples are medium/high risk. Prioritize weekly reassessment.`,
        type: "Monitoring",
      },
      {
        title: "Foot Support",
        desc: `${flatYes} samples are flat-foot positive. Arch-support footwear can help reduce stress.`,
        type: "Equipment",
      },
      {
        title: "Age Band Review",
        desc: "Compare gait trends by age band in analytics to target intervention groups.",
        type: "Analysis",
      },
    ];

    return recs;
  }, [summary]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Live movement summary from your imported dataset.
          </p>
        </div>

        {loading && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading dashboard data...
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && summary && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {s.label}
                          </p>
                          <p className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.sub}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <s.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      {s.progress !== undefined && (
                        <Progress value={s.progress} className="mt-3 h-1.5" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="daily">Daily Stats</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Gait Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={scoreChartData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="label" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="target" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Imported Samples</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activityTimeline.map((a, i) => (
                          <div key={a.id} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              {i < activityTimeline.length - 1 && <div className="w-px h-8 bg-border" />}
                            </div>
                            <div className="flex-1 pb-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{a.activity}</p>
                                <span className="text-xs text-muted-foreground">{a.time}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {a.steps.toLocaleString()} sensor hits | {a.duration}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="daily">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dataset Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div className="space-y-1">
                        <MapPin className="h-5 w-5 text-primary mx-auto" />
                        <p className="text-2xl font-bold">{summary.avgAge.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Average Age</p>
                      </div>
                      <div className="space-y-1">
                        <Clock className="h-5 w-5 text-primary mx-auto" />
                        <p className="text-2xl font-bold">{summary.totalSamples}</p>
                        <p className="text-xs text-muted-foreground">Total Samples</p>
                      </div>
                      <div className="space-y-1">
                        <Flame className="h-5 w-5 text-primary mx-auto" />
                        <p className="text-2xl font-bold">{summary.avgForceImbalance.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Avg Imbalance</p>
                      </div>
                      <div className="space-y-1">
                        <TrendingUp className="h-5 w-5 text-primary mx-auto" />
                        <p className="text-2xl font-bold">{summary.avgGaitScore.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Avg Gait Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weekly">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gait Trend by Age Band</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={ageBandTrend}>
                        <defs>
                          <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="ageBand" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="avgGaitScore"
                          stroke="hsl(var(--primary))"
                          fill="url(#stepGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts">
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const type =
                      alert.severity === "high"
                        ? "error"
                        : alert.severity === "medium"
                        ? "warning"
                        : "info";
                    return (
                      <Card key={alert.id} className="overflow-hidden">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                              type === "error"
                                ? "bg-destructive/10"
                                : type === "warning"
                                ? "bg-warning/10"
                                : "bg-info/10"
                            }`}
                          >
                            {type === "error" ? (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            ) : type === "warning" ? (
                              <AlertTriangle className="h-5 w-5 text-warning" />
                            ) : (
                              <Bell className="h-5 w-5 text-info" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{alert.title}</p>
                              <span className="text-xs text-muted-foreground">
                                Row {alert.source_row_number}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.title}>
                      <CardContent className="p-5 space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {rec.type}
                        </Badge>
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
