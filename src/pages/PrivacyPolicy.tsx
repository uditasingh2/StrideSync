import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly, including name, email, and health-related gait data from your StrideSync device. We also collect usage data such as app interactions, device information, and analytics." },
  { title: "How We Use Your Data", content: "Your data is used to provide gait analysis, generate health insights, improve our AI models (anonymized), and communicate important updates. We never sell your personal health data to third parties." },
  { title: "Data Storage & Security", content: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Health data is stored in HIPAA-compliant infrastructure. We conduct regular security audits and penetration testing." },
  { title: "Data Sharing", content: "We share data only with your explicit consent — for example, when you choose to share reports with your healthcare provider. Aggregated, anonymized data may be used for research purposes." },
  { title: "Your Rights", content: "You have the right to access, correct, delete, or export your data at any time. You can revoke consent for data processing and request a complete data deletion from our systems." },
  { title: "Cookies & Tracking", content: "We use essential cookies for authentication and preferences. Analytics cookies are optional and can be disabled in your settings. We do not use third-party advertising trackers." },
  { title: "Changes to This Policy", content: "We may update this policy periodically. Significant changes will be communicated via email and in-app notifications. Continued use of StrideSync after changes constitutes acceptance." },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Privacy <span className="text-primary">Policy</span></h1>
        <p className="text-muted-foreground">Last updated: February 1, 2026</p>
      </motion.div>
      {sections.map((s, i) => (
        <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="space-y-2">
          <h2 className="text-xl font-semibold">{s.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{s.content}</p>
        </motion.div>
      ))}
    </section>
    <Footer />
  </div>
);

export default PrivacyPolicy;
