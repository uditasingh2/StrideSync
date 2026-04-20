import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cookieTypes = [
  { name: "Essential Cookies", desc: "Required for authentication, security, and basic functionality. Cannot be disabled.", required: true },
  { name: "Analytics Cookies", desc: "Help us understand how you use StrideSync so we can improve the experience. Anonymized data only.", required: false },
  { name: "Preference Cookies", desc: "Remember your settings like theme, language, and dashboard layout preferences.", required: false },
  { name: "Performance Cookies", desc: "Monitor app performance and loading times to optimize your experience.", required: false },
];

const Cookies = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Cookie <span className="text-primary">Policy</span></h1>
        <p className="text-muted-foreground">Last updated: February 1, 2026</p>
      </motion.div>
      <div className="space-y-4 text-muted-foreground">
        <p>StrideSync uses cookies and similar technologies to provide, protect, and improve our services. This policy explains what cookies we use and why.</p>
        <h2 className="text-xl font-semibold text-foreground">What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and understand how you interact with our platform.</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Types of Cookies We Use</h2>
        {cookieTypes.map((cookie, i) => (
          <motion.div key={cookie.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {cookie.name}
                  {cookie.required && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Required</span>}
                </CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{cookie.desc}</p></CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="space-y-4 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Managing Cookies</h2>
        <p>You can manage cookie preferences in your StrideSync settings or through your browser settings. Note that disabling essential cookies may affect the functionality of the platform.</p>
      </div>
    </section>
    <Footer />
  </div>
);

export default Cookies;
