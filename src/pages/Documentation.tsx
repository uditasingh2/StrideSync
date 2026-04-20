import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Code, Cpu, Database, Wifi, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docs = [
  { icon: FileText, title: "Quick Start Guide", desc: "Get up and running with StrideSync in under 5 minutes." },
  { icon: Code, title: "API Reference", desc: "Complete REST API documentation for developers." },
  { icon: Cpu, title: "Device Setup", desc: "Pairing, calibration, and firmware update guides." },
  { icon: Database, title: "Data Export", desc: "Export your walking data in CSV, JSON, or PDF format." },
  { icon: Wifi, title: "Integration Guide", desc: "Connect StrideSync with EHR systems and third-party apps." },
  { icon: Lock, title: "Security & Compliance", desc: "HIPAA compliance, encryption, and data handling policies." },
];

const Documentation = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold"><span className="text-primary">Documentation</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to integrate and use StrideSync effectively.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {docs.map((doc, i) => (
          <motion.div key={doc.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2"><doc.icon className="h-5 w-5 text-primary" /></div>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{doc.desc}</p></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Documentation;
