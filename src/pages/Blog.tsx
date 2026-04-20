import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const posts = [
  { title: "How AI is Transforming Gait Analysis", date: "Feb 10, 2026", tag: "Technology", excerpt: "Discover how machine learning models can detect walking pattern anomalies with over 95% accuracy." },
  { title: "5 Signs Your Walking Pattern Needs Attention", date: "Feb 5, 2026", tag: "Health", excerpt: "Learn the subtle signs that your gait may be signaling an underlying health concern." },
  { title: "StrideSync Partners with Leading Rehab Centers", date: "Jan 28, 2026", tag: "News", excerpt: "We're excited to announce partnerships with 50+ rehabilitation centers across the country." },
  { title: "Understanding Pressure Mapping Technology", date: "Jan 20, 2026", tag: "Technology", excerpt: "A deep dive into how our smart soles measure and interpret foot pressure distribution." },
  { title: "The Future of Remote Patient Monitoring", date: "Jan 12, 2026", tag: "Healthcare", excerpt: "How wearable tech is enabling doctors to monitor patients from anywhere in the world." },
  { title: "Monthly Product Update: January 2026", date: "Jan 5, 2026", tag: "Product", excerpt: "New features, improvements, and what's coming next for StrideSync users." },
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">StrideSync <span className="text-primary">Blog</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Insights on gait analysis, mobility health, and the technology powering smarter movement.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div key={post.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.tag}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{post.excerpt}</p></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Blog;
