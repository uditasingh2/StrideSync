import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  { name: "Free", price: "$0", period: "/month", desc: "Basic gait tracking for individuals.", features: ["Daily step tracking", "Basic gait score", "7-day history", "Email support"], cta: "Get Started" },
  { name: "Pro", price: "$14.99", period: "/month", desc: "Advanced analytics and health insights.", features: ["Everything in Free", "AI gait analysis", "Unlimited history", "Health alerts & reports", "Priority support"], cta: "Start Free Trial", popular: true },
  { name: "Clinical", price: "$49.99", period: "/month", desc: "For healthcare professionals and clinics.", features: ["Everything in Pro", "Doctor dashboard", "Patient management", "PDF report generation", "API access", "HIPAA compliance"], cta: "Contact Sales" },
];

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent <span className="text-primary">Pricing</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that fits your needs. Upgrade or downgrade anytime.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`h-full relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2"><span className="text-4xl font-bold">{plan.price}</span><span className="text-muted-foreground">{plan.period}</span></div>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Pricing;
