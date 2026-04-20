// StrideSync Mock Data

export const weeklySteps = [
  { day: "Mon", steps: 8423, goal: 10000 },
  { day: "Tue", steps: 11245, goal: 10000 },
  { day: "Wed", steps: 6832, goal: 10000 },
  { day: "Thu", steps: 9567, goal: 10000 },
  { day: "Fri", steps: 12034, goal: 10000 },
  { day: "Sat", steps: 7891, goal: 10000 },
  { day: "Sun", steps: 5234, goal: 10000 },
];

export const monthlySteps = [
  { week: "W1", steps: 62340 },
  { week: "W2", steps: 71250 },
  { week: "W3", steps: 58900 },
  { week: "W4", steps: 68420 },
];

export const gaitSymmetry = [
  { time: "6am", left: 48, right: 52 },
  { time: "8am", left: 50, right: 50 },
  { time: "10am", left: 47, right: 53 },
  { time: "12pm", left: 49, right: 51 },
  { time: "2pm", left: 51, right: 49 },
  { time: "4pm", left: 46, right: 54 },
  { time: "6pm", left: 44, right: 56 },
  { time: "8pm", left: 48, right: 52 },
];

export const pressureData = {
  leftFoot: [
    { zone: "heel", pressure: 72, x: 50, y: 85 },
    { zone: "arch", pressure: 35, x: 45, y: 55 },
    { zone: "ball", pressure: 85, x: 40, y: 25 },
    { zone: "toes", pressure: 60, x: 50, y: 8 },
  ],
  rightFoot: [
    { zone: "heel", pressure: 78, x: 50, y: 85 },
    { zone: "arch", pressure: 30, x: 55, y: 55 },
    { zone: "ball", pressure: 80, x: 60, y: 25 },
    { zone: "toes", pressure: 55, x: 50, y: 8 },
  ],
};

export const trendData = [
  { date: "Jan", gaitScore: 72, steps: 195000, posture: 68 },
  { date: "Feb", gaitScore: 75, steps: 210000, posture: 71 },
  { date: "Mar", gaitScore: 78, steps: 225000, posture: 74 },
  { date: "Apr", gaitScore: 74, steps: 198000, posture: 70 },
  { date: "May", gaitScore: 82, steps: 240000, posture: 79 },
  { date: "Jun", gaitScore: 85, steps: 255000, posture: 82 },
];

export const healthAlerts = [
  { id: 1, type: "warning" as const, title: "Gait Asymmetry Detected", message: "Right foot bearing 8% more weight than normal. Consider stretching exercises.", time: "2 hours ago" },
  { id: 2, type: "info" as const, title: "Daily Goal Reached!", message: "You've hit 10,000 steps today. Great job!", time: "4 hours ago" },
  { id: 3, type: "error" as const, title: "Injury Risk Alert", message: "Repeated heel striking pattern detected. Risk of plantar fasciitis. Recommended: heel cushion inserts.", time: "1 day ago" },
  { id: 4, type: "info" as const, title: "Weekly Report Ready", message: "Your weekly gait analysis report is available for download.", time: "2 days ago" },
];

export const aiInsights = [
  { title: "Posture Improvement", description: "Your walking posture has improved by 12% over the past month. Keep up the good work!", icon: "trending-up" },
  { title: "Rest Recommendation", description: "Based on your activity patterns, we recommend a 15-minute rest after your afternoon walk.", icon: "coffee" },
  { title: "Exercise Suggestion", description: "Calf stretches can help improve your detected heel-strike pattern. Try 3 sets of 30 seconds.", icon: "dumbbell" },
  { title: "Symmetry Alert", description: "Your left-right balance shifts after 4pm. Consider supportive footwear for evening walks.", icon: "alert-triangle" },
];

export const activityTimeline = [
  { time: "7:00 AM", activity: "Morning walk", steps: 2340, duration: "25 min" },
  { time: "9:30 AM", activity: "Office commute", steps: 1200, duration: "15 min" },
  { time: "12:15 PM", activity: "Lunch walk", steps: 1800, duration: "20 min" },
  { time: "3:00 PM", activity: "Afternoon stroll", steps: 950, duration: "10 min" },
  { time: "6:30 PM", activity: "Evening exercise", steps: 4200, duration: "45 min" },
];

export const stats = {
  dailySteps: 10490,
  dailyGoal: 12000,
  gaitScore: 85,
  postureStatus: "Normal" as "Normal" | "Warning" | "Critical",
  caloriesBurned: 423,
  distanceKm: 7.8,
  activeMinutes: 95,
};
