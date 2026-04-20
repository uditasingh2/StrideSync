import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing or using StrideSync, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately." },
  { title: "2. Description of Service", content: "StrideSync provides AI-powered gait analysis through smart shoe sole technology. Our service includes data collection, health insights, and optional sharing with healthcare providers. The service is not a substitute for professional medical advice." },
  { title: "3. User Accounts", content: "You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account." },
  { title: "4. Acceptable Use", content: "You agree not to misuse the service, attempt unauthorized access, reverse-engineer our technology, or use the platform for any unlawful purpose." },
  { title: "5. Health Disclaimer", content: "StrideSync is a wellness and monitoring tool, not a medical device. Our analyses and recommendations should not replace professional medical consultation. Always consult a qualified healthcare provider for medical decisions." },
  { title: "6. Intellectual Property", content: "All content, algorithms, and technology within StrideSync are owned by StrideSync Inc. You retain ownership of your personal data but grant us a license to process it for service delivery." },
  { title: "7. Limitation of Liability", content: "StrideSync is provided 'as is' without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service." },
  { title: "8. Termination", content: "We may terminate or suspend your account for violation of these terms. You may delete your account at any time, and we will remove your data per our Privacy Policy." },
];

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 max-w-4xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Terms of <span className="text-primary">Service</span></h1>
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

export default TermsOfService;
