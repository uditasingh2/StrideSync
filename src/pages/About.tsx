import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Heart, Globe } from "lucide-react";

const values = [
  { icon: Target, title: "Mission-Driven", desc: "We're building technology that makes healthcare accessible through smart wearable insights." },
  { icon: Heart, title: "User-First", desc: "Every feature we build starts with a real user need — from patients to physicians." },
  { icon: Users, title: "Collaborative", desc: "We bridge the gap between patients, doctors, and data with seamless connectivity." },
  { icon: Globe, title: "Global Impact", desc: "Our goal is to improve mobility health for millions of people worldwide." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">About <span className="text-primary">StrideSync</span></h1>
        <p className="text-lg text-muted-foreground">We're on a mission to revolutionize mobility health through AI-powered smart shoe sole technology. Our team combines expertise in biomechanics, machine learning, and healthcare to build the future of gait analysis.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-2xl border bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><v.icon className="h-5 w-5 text-primary" /></div>
            <h3 className="font-semibold">{v.title}</h3>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
        <p>Founded in 2024, StrideSync began as a research project exploring how pressure-sensitive insoles could detect early signs of mobility disorders. Today, we've grown into a platform that serves patients, doctors, and researchers with real-time gait analytics.</p>
        <p>Our AI models process millions of steps daily, identifying patterns that help prevent injuries, improve rehabilitation outcomes, and give healthcare professionals unprecedented visibility into patient mobility.</p>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;
