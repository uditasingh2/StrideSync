import { motion } from "framer-motion";
import { Activity, Bell, Stethoscope, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Activity,
    title: "Smart Gait Analysis",
    description: "Our AI-powered sensors analyze every step you take, mapping pressure distribution and detecting subtle imbalances before they become problems.",
    bullets: [
      "Detects walking imbalance & posture issues",
      "AI-based step pattern recognition",
      "Real-time pressure distribution mapping",
      "Historical pattern comparison",
    ],
  },
  {
    icon: Bell,
    title: "Health Notifications",
    description: "Stay informed with intelligent alerts that adapt to your activity. From daily goals to injury prevention, StrideSync keeps you safe.",
    bullets: [
      "Real-time alerts for risky movement patterns",
      "Daily walking goals & smart reminders",
      "Injury prevention warnings",
      "Fatigue detection & rest suggestions",
    ],
  },
  {
    icon: Stethoscope,
    title: "Doctor Monitoring Dashboard",
    description: "Enable your healthcare professionals to monitor your gait data remotely with secure, HIPAA-friendly dashboards and downloadable reports.",
    bullets: [
      "Remote patient gait monitoring",
      "Downloadable PDF gait reports",
      "Secure data access for professionals",
      "Real-time sharing with your care team",
    ],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container py-24">
        <div className="text-center mb-20 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Powerful Features for{" "}
            <span className="text-primary">Smarter Movement</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover how StrideSync transforms the way you walk, move, and live with cutting-edge AI analysis.
          </motion.p>
        </div>

        <div className="space-y-32">
          {features.map((feature, i) => {
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-20`}
              >
                {/* Visual */}
                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <feature.icon className="h-24 w-24 text-primary/30" />
                    <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{feature.title}</p>
                          <p className="text-xs text-muted-foreground">Active & Monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">{feature.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                        <span className="text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="mt-4">Learn More</Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
