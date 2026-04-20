import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const openings = [
  { title: "Senior ML Engineer", location: "Remote", type: "Full-time", dept: "Engineering" },
  { title: "Frontend Developer (React)", location: "San Francisco, CA", type: "Full-time", dept: "Engineering" },
  { title: "Biomedical Data Scientist", location: "Remote", type: "Full-time", dept: "Research" },
  { title: "Product Designer", location: "New York, NY", type: "Full-time", dept: "Design" },
  { title: "Clinical Partnerships Manager", location: "Remote", type: "Full-time", dept: "Business" },
];

const Careers = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">Join <span className="text-primary">StrideSync</span></h1>
        <p className="text-lg text-muted-foreground">Help us build the future of mobility health. We're looking for passionate people who want to make a real impact.</p>
      </motion.div>
      <div className="space-y-4 max-w-3xl mx-auto">
        {openings.map((job, i) => (
          <motion.div key={job.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <Badge variant="outline">{job.type}</Badge>
                    <Badge variant="secondary">{job.dept}</Badge>
                  </div>
                </div>
                <Button size="sm">Apply</Button>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Careers;
