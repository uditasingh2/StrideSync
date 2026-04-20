import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Shield, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const benefits = [
  { icon: Activity, title: "Smart Gait Analysis", description: "AI detects walking imbalances and posture issues in real-time with precision pressure mapping." },
  { icon: Shield, title: "Injury Prevention", description: "Get proactive alerts before injuries happen. Our AI learns your patterns and warns you early." },
  { icon: Brain, title: "AI Recommendations", description: "Personalized exercises, rest suggestions, and posture tips tailored to your unique walking style." },
  { icon: Heart, title: "Doctor Monitoring", description: "Share gait data securely with healthcare professionals for remote monitoring and consultations." },
];

const statsData = [
  { value: 2500000, suffix: "+", label: "Steps Analyzed Daily" },
  { value: 97, suffix: "%", label: "Posture Accuracy" },
  { value: 15000, suffix: "+", label: "Active Users" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 dark:from-primary/10 dark:to-accent/5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container relative py-24 md:py-36 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              AI-Powered Smart Sole Technology
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Walk Smarter.{" "}
              <span className="text-primary">Move Better.</span>{" "}
              Live Healthier.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              StrideSync uses AI-powered sensors in your shoe sole to analyze your gait, prevent injuries, and optimize your movement — all in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button asChild size="lg" className="glow-primary text-base px-8">
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link to="/features">Explore Features</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Why StrideSync?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to understand, improve, and protect your movement.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {statsData.map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Ready to walk smarter?</h2>
          <p className="text-muted-foreground">Join thousands of users who trust StrideSync for healthier movement.</p>
          <Button asChild size="lg" className="glow-primary">
            <Link to="/dashboard">Start Your Journey <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
