import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container py-24 space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Get in <span className="text-primary">Touch</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Have questions about StrideSync? We'd love to hear from you.</p>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <Card>
          <CardHeader><CardTitle>Send us a message</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First name</Label><Input placeholder="John" /></div>
              <div className="space-y-2"><Label>Last name</Label><Input placeholder="Doe" /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="john@example.com" /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Tell us how we can help..." rows={5} /></div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {[
            { icon: Mail, title: "Email", info: "support@stridesync.com" },
            { icon: Phone, title: "Phone", info: "+1 (555) 123-4567" },
            { icon: MapPin, title: "Office", info: "123 Innovation Drive, San Francisco, CA 94105" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><item.icon className="h-5 w-5 text-primary" /></div>
              <div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.info}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Contact;
