import SEO from '../components/seo/SEO';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactConfig {
  office_address: string;
  map_embed_url: string;
  emails: { label: string; email: string }[];
  phones: { label: string; number: string }[];
  social_links: Record<string, string>;
  working_hours: { days: string; hours: string }[];
}

export default function ContactUs() {
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    async function fetchContact() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';
        const res = await fetch(`${API_URL}/app/contact`);
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch (err) {
        console.error('Failed to fetch contact details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';
      const res = await fetch(`${API_URL}/app/contact/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error((err as Error).message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
      <SEO 
        title="Contact Security Desk & Support | Transfer Legacy"
        description="Reach out to our security engineering team and support desk for institutional inquiries, vault assistance, and partnership opportunities."
        canonicalUrl="https://transferlegacy.com/contact"
        schema={{
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Transfer Legacy",
    "url": "https://transferlegacy.com/contact",
    "description": "Contact Transfer Legacy security and customer support team."
  }}
      />

        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
              Let's Start a Conversation
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              Have questions about securing your digital legacy? Our team is here to help you navigate the future of inheritance.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Info & Map */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 gap-6"
            >
              {/* Info Cards */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm group hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Our Office</h3>
                    <p className="text-slate-400 leading-relaxed">
                      {config?.office_address || '123 Legacy Way, Digital District, CA 94105'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm group hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                    <div className="space-y-2">
                      {config?.emails.map((e, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-400">
                          <span>{e.label}</span>
                          <a href={`mailto:${e.email}`} className="text-indigo-400 hover:underline">{e.email}</a>
                        </div>
                      )) || <p className="text-slate-400">support@transferlegacy.com</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm group hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
                    <div className="space-y-2">
                      {config?.working_hours.map((w, i) => (
                        <div key={i} className="flex justify-between items-center text-slate-400">
                          <span>{w.days}</span>
                          <span>{w.hours}</span>
                        </div>
                      )) || <p className="text-slate-400">Mon - Fri: 9am - 6pm PST</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Embed */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[300px] rounded-2xl overflow-hidden border border-white/5 bg-slate-900 grayscale brightness-75 contrast-125"
            >
              <iframe 
                src={config?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789!2d-122.3999!3d37.789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085806e!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1234567890"}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
              />
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 rounded-3xl bg-slate-900/30 border border-white/5 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <MessageSquare size={120} className="text-indigo-500" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help?"
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Write your message here..."
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                  />
                </div>

                <button 
                  disabled={submitting}
                  className="w-full py-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
                >
                  {submitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
