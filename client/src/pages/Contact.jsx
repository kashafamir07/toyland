import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "../components/common/Button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for contact messages yet — this is UI-only for now
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="bg-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-lg mx-auto mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-plum">Get in Touch</h1>
          <p className="text-plum/60 mt-3">
            Questions about an order, a toy, or anything else — we're happy to help.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8">
          <div className="space-y-4">
            <ContactInfoCard icon={Mail} title="Email Us" detail="support@toyland.pk" />
            <ContactInfoCard icon={Phone} title="Call Us" detail="+92 300 1234567" />
            <ContactInfoCard icon={MapPin} title="Visit Us" detail="Gulberg III, Lahore, Pakistan" />
          </div>

          <div className="bg-white rounded-2xl border border-plum/5 p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <span className="text-4xl">🎉</span>
                <p className="font-display font-bold text-lg text-plum mt-4">Message sent!</p>
                <p className="text-plum/50 text-sm mt-1">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send size={16} /> Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfoCard({ icon: Icon, title, detail }) {
  return (
    <div className="bg-white rounded-2xl border border-plum/5 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center shrink-0">
        <Icon size={20} className="text-plum" />
      </div>
      <div>
        <p className="font-display font-bold text-sm text-plum">{title}</p>
        <p className="text-sm text-plum/60">{detail}</p>
      </div>
    </div>
  );
}