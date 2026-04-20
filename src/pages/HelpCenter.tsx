import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Search, BookOpen, MessageCircle, Settings, Smartphone, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const categories = [
  { icon: Smartphone, title: "Getting Started", desc: "Set up your StrideSync device and start tracking.", count: 12 },
  { icon: BookOpen, title: "Using the Dashboard", desc: "Navigate charts, alerts, and reports.", count: 8 },
  { icon: Settings, title: "Account & Settings", desc: "Manage your profile and preferences.", count: 6 },
  { icon: Shield, title: "Privacy & Security", desc: "Understand how we protect your data.", count: 5 },
  { icon: MessageCircle, title: "Doctor Integration", desc: "Share data with your healthcare team.", count: 7 },
];

const HelpCenter = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Help <span className="text-primary">Center</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Find answers, guides, and support for everything StrideSync.</p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10" />
        </div>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {categories.map((cat, i) => (
          <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><cat.icon className="h-5 w-5 text-primary" /></div>
                <CardTitle className="text-lg">{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
                <p className="text-xs text-muted-foreground mt-2">{cat.count} articles</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default HelpCenter;
