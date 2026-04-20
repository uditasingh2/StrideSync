import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, MessageSquare, Github, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const channels = [
  { icon: MessageSquare, title: "Discord Community", desc: "Join 5,000+ members discussing gait health and StrideSync tips.", action: "Join Discord" },
  { icon: Github, title: "Open Source", desc: "Contribute to our open-source analysis tools and SDKs.", action: "View GitHub" },
  { icon: Users, title: "Forum", desc: "Ask questions, share experiences, and connect with other users.", action: "Visit Forum" },
  { icon: Trophy, title: "Ambassador Program", desc: "Become a StrideSync ambassador and earn exclusive rewards.", action: "Learn More" },
];

const Community = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Our <span className="text-primary">Community</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Connect with thousands of users, developers, and healthcare professionals.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {channels.map((ch, i) => (
          <motion.div key={ch.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><ch.icon className="h-5 w-5 text-primary" /></div>
                <CardTitle className="text-lg">{ch.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{ch.desc}</p>
                <Button variant="outline" size="sm">{ch.action}</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Community;
